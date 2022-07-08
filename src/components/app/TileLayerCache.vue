<template>
  <div></div>
</template>

<script>
// import SQL from "sql.js";
import PouchDB from "pouchdb";
PouchDB.plugin(require("pouchdb-upsert"));

export default {
  created() {
    // HTMLCanvasElement.toBlob() polyfill
    // copy-pasted off https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob
    const self = this;

    // allow canvas to convert to Blob
    if (!HTMLCanvasElement.prototype.toBlob) {
      Object.defineProperty(HTMLCanvasElement.prototype, "toBlob", {
        value(callback, type, quality) {
          const dataURL = this.toDataURL(type, quality).split(",")[1];
          setTimeout(() => {
            const binStr = atob(dataURL);
            const len = binStr.length;
            const arr = new Uint8Array(len);

            for (let i = 0; i < len; i++) {
              arr[i] = binStr.charCodeAt(i);
            }

            callback(
              new Blob([arr], {
                type: type || "image/png"
              })
            );
          });
        }
      });
    }

    // Set DB null if not useCache and init pouchDB
    L.TileLayer.addInitHook(function() {
      if (!this.options.useCache) {
        this._db = null;
        return;
      }

      this._db = new PouchDB("offline-tiles");
    });

    // 🍂namespace TileLayer
    // 🍂section PouchDB tile caching options
    // 🍂option useCache: Boolean = false
    // Whether to use a PouchDB cache on this tile layer, or not
    L.TileLayer.prototype.options.useCache = false;

    // Vantum orthomosaic identificator
    L.TileLayer.prototype.options.orthomosaicId = null;

    // 🍂option saveToCache: Boolean = true
    // When caching is enabled, whether to save new tiles to the cache or not
    L.TileLayer.prototype.options.saveToCache = true;

    // 🍂option useOnlyCache: Boolean = false
    // When caching is enabled, whether to request new tiles from the network or not
    L.TileLayer.prototype.options.useOnlyCache = false;

    // 🍂option cacheFormat: String = 'image/png'
    // The image format to be used when saving the tile images in the cache
    L.TileLayer.prototype.options.cacheFormat = "image/png";

    // 🍂option cacheMaxAge: Number = 24*3600*1000
    // Maximum age of the cache, in milliseconds
    L.TileLayer.prototype.options.cacheMaxAge = 24 * 3600 * 1000;

    L.TileLayer.include({
      // Overwrites L.TileLayer.prototype.createTile
      createTile(coords, done) {
        const tile = document.createElement("img");

        tile.onerror = L.bind(this._tileOnError, this, done, tile);

        if (this.options.crossOrigin) {
          tile.crossOrigin = "";
        }

        /*
     Alt tag is *set to empty string to keep screen readers from reading URL and for compliance reasons
     http://www.w3.org/TR/WCAG20-TECHS/H67
     */
        tile.alt = "";

        const tileUrl = this.getTileUrl(coords);

        if (this.options.useCache) {
          this._db.get(
            tileUrl,
            {
              revs_info: true
            },
            this._onCacheLookup(tile, tileUrl, done)
          );
        } else {
          // Fall back to standard behaviour
          tile.onload = L.bind(this._tileOnLoad, this, done, tile);
          tile.src = tileUrl;
        }

        return tile;
      },

      // Returns a callback (closure over tile/key/originalSrc) to be run when the DB
      //   backend is finished with a fetch operation.
      _onCacheLookup(tile, tileUrl, done) {
        return function(err, data) {
          if (data) {
            return this._onCacheHit(tile, tileUrl, data, done);
          }
          return this._onCacheMiss(tile, tileUrl, done);
        }.bind(this);
      },

      _onCacheHit(tile, tileUrl, data, done) {
        this.fire("tilecachehit", {
          tile,
          url: tileUrl
        });
        // console.log("tilecachehit", {
        //   tile,
        //   url: tileUrl
        // });

        // Read the attachment as blob
        this._db.getAttachment(tileUrl, "tile").then(blob => {
          const url = URL.createObjectURL(blob);

          if (data.expireAt) {
            if (new Date() > Date.parse(data.expireAt)) {
              // console.log("Tile is too old: ", tileUrl);

              if (this.options.saveToCache) {
                tile.onload = L.bind(
                  this._saveTile,
                  this,
                  tile,
                  tileUrl,
                  data._revs_info[0].rev,
                  done
                );
              }
              tile.crossOrigin = "Anonymous";
              tile.src = tileUrl;
              tile.onerror = function(ev) {
                // If the tile is too old but couldn't be fetched from the network,
                //   serve the one still in cache.
                this.src = url;
              };
            } else {
              // Serve tile from cached data
              // console.log('Tile is cached: ', tileUrl);
              tile.onload = L.bind(this._tileOnLoad, this, done, tile);
              tile.src = url;
            }
          } else {
            if (
              Date.now() > data.timestamp + this.options.cacheMaxAge &&
              !this.options.useOnlyCache
            ) {
              // Tile is too old, try to refresh it
              // console.log("Tile is too old: ", tileUrl);

              if (this.options.saveToCache) {
                tile.onload = L.bind(
                  this._saveTile,
                  this,
                  tile,
                  tileUrl,
                  data._revs_info[0].rev,
                  done
                );
              }
              tile.crossOrigin = "Anonymous";
              tile.src = tileUrl;
              tile.onerror = function(ev) {
                // If the tile is too old but couldn't be fetched from the network,
                //   serve the one still in cache.
                this.src = url;
              };
            } else {
              // Serve tile from cached data
              // console.log('Tile is cached: ', tileUrl);
              tile.onload = L.bind(this._tileOnLoad, this, done, tile);
              tile.src = url;
            }
          }
        });
      },

      _onCacheMiss(tile, tileUrl, done) {
        this.fire("tilecachemiss", {
          tile,
          url: tileUrl
        });
        // console.log("tilecachemiss", {
        //   tile,
        //   url: tileUrl
        // });
        if (this.options.useOnlyCache) {
          // Offline, not cached
          // 	console.log('Tile not in cache', tileUrl);
          tile.onload = L.Util.falseFn;
          tile.src = L.Util.emptyImageUrl;
        } else {
          // Online, not cached, request the tile normally
          // console.log('Requesting tile normally', tileUrl);
          if (this.options.saveToCache) {
            tile.onload = L.bind(
              this._saveTile,
              this,
              tile,
              tileUrl,
              undefined,
              done
            );
          } else {
            tile.onload = L.bind(this._tileOnLoad, this, done, tile);
          }
          tile.crossOrigin = "Anonymous";
          tile.src = tileUrl;
        }
      },

      // Async'ly saves the tile as a PouchDB attachment
      // Will run the done() callback (if any) when finished.
      _saveTile(tile, tileUrl, existingRevision, done) {
        // console.log("input: ", tile, tileUrl, existingRevision, done);
        // console.log("tileUrl", tileUrl);
        if (!this.options.saveToCache) {
          return;
        }

        const canvas = document.createElement("canvas");
        canvas.width = tile.naturalWidth || tile.width;
        canvas.height = tile.naturalHeight || tile.height;

        const context = canvas.getContext("2d");

        context.drawImage(tile, 0, 0);

        const format = this.options.cacheFormat;

        // Save blob (image/tile) to pouch
        canvas.toBlob(blob => {
          this._db
            .put({
              _id: tileUrl,
              _rev: existingRevision,
              orthomosaicId: this.options.orthomosaicId,
              timestamp: Date.now()
            })
            .then(status =>
              this._db.putAttachment(tileUrl, "tile", status.rev, blob, format)
            )
            .then(resp => {
              if (done) {
                done();
              }
            })
            .catch(() => {
              // Saving the tile to the cache might have failed,
              // but the tile itself has been loaded.
              if (done) {
                done();
              }
            });
        }, format);
      },

      // 🍂section PouchDB tile caching methods
      // 🍂method seed(bbox: LatLngBounds, minZoom: Number, maxZoom: Number): this
      // Starts seeding the cache given a bounding box and the minimum/maximum zoom levels
      // Use with care! This can spawn thousands of requests and flood tileservers!
      seed(bbox, minZoom, maxZoom) {
        if (!this.options.useCache) return;
        if (minZoom > maxZoom) return;
        if (!this._map) return;

        const queue = [];

        for (let z = minZoom; z <= maxZoom; z++) {
          // Geo bbox to pixel bbox (as per given zoom level)...
          const northEastPoint = this._map.project(bbox.getNorthEast(), z);
          const southWestPoint = this._map.project(bbox.getSouthWest(), z);

          // Then to tile coords bounds, as per GridLayer
          const tileBounds = this._pxBoundsToTileRange(
            L.bounds([northEastPoint, southWestPoint])
          );

          for (let j = tileBounds.min.y; j <= tileBounds.max.y; j++) {
            for (let i = tileBounds.min.x; i <= tileBounds.max.x; i++) {
              const point = new L.Point(i, j);
              point.z = z;
              queue.push(this._getTileUrl(point));
            }
          }
        }

        const seedData = {
          bbox,
          minZoom,
          maxZoom,
          queueLength: queue.length
        };
        console.log("seeddata", seedData);
        this.fire("seedstart", seedData);
        const tile = this._createTile();
        tile._layer = this;
        // console.log("tile-layer", tile._layer)
        // console.log("queue", queue)

        this._seedOneTile(tile, queue, seedData);
        return this;
      },

      async downloadTilesMB(bbox, minZoom, maxZoom, databaseUrl) {
        return new Promise(async (resolve, reject) => {
          if (!this.options.useCache) return;
          if (minZoom > maxZoom) return;
          if (!this._map) return;
          let queue = [];

          this.fire("download-start");
          // console.log("download-start");
          fetch(databaseUrl)
            .then(response => {
              return response.arrayBuffer();
            })
            .then(buffer => {
              // console.log("package downloaded");
              this.fire("download-finish");
              this._openDB(buffer);

              // let z = 14;
              let progress = 0;
              let totalProgress = 0;
              let count = this.getMbTileCount();

              for (let z = minZoom; z <= maxZoom; z++) {
                const min = this._map
                  .project(bbox.getNorthWest(), z)
                  .divideBy(256)
                  .floor();
                const max = this._map
                  .project(bbox.getSouthEast(), z)
                  .divideBy(256)
                  .floor();

                const max_y = Math.pow(2, z) - 1;
                for (let i = min.x; i <= max.x; i++) {
                  for (let j = min.y; j <= max.y; j++) {
                    let coords = new L.Point(i, j);
                    coords.z = z;

                    // Check if layer is WMS or TMS, tileLayer.options.tms is used as an example
                    if (this.options.tms) {
                      coords.y = max_y - coords.y;
                    }
                    // console.log(this.options.tms, max_y);

                    let url = L.Util.template(this._url, coords);
                    // console.log(coords);

                    let blob = this.getMbTileBlob(coords).then(async blob => {
                      if (blob != null) {
                        await this._saveTileFromBlob(url, null, blob).then(
                          () => {
                            progress = progress + 1;
                            this.fire("download-progress", progress);
                            self.$root.$emit("cache-update", {
                              total: count,
                              progress
                            });
                            // console.log("download-progress", progress);
                          }
                        );
                      }
                    });
                  }
                }
              }
            })
            .catch(err => {
              this.fire("databaseerror", { error: err });
            });
          resolve();
        });
      },

      async downloadTiles(bbox, minZoom, maxZoom) {
        return new Promise(async (resolve, reject) => {
          if (!this.options.useCache) return;
          if (minZoom > maxZoom) return;
          if (!this._map) return;
          let queue = [];

          // let z = 14;

          for (let z = minZoom; z <= maxZoom; z++) {
            const min = this._map
              .project(bbox.getNorthWest(), z)
              .divideBy(256)
              .floor();
            const max = this._map
              .project(bbox.getSouthEast(), z)
              .divideBy(256)
              .floor();

            const max_y = Math.pow(2, z) - 1;

            for (let i = min.x; i <= max.x; i++) {
              for (let j = min.y; j <= max.y; j++) {
                let coords = new L.Point(i, j);
                coords.z = z;

                // Check if layer is WMS or TMS, tileLayer.options.tms is used as an example
                if (this.options.tms) {
                  coords.y = max_y - coords.y;
                }

                let url = L.Util.template(this._url, coords);
                // console.log(coords, url);
                queue.push(url);
              }
            }
          }

          console.log("tamanho da fila de download:", queue.length);

          const seedData = {
            bbox,
            minZoom,
            maxZoom,
            queueLength: queue.length
          };
          console.log("downloaddata", seedData);
          this.fire("downloadstart", seedData);

          for (let index = 0; index < seedData.queueLength; index++) {
            if (!queue.length) {
              this.fire("downloadend", seedData);
              return;
            }
            this.fire("downloadprogress", {
              bbox: seedData.bbox,
              minZoom: seedData.minZoom,
              maxZoom: seedData.maxZoom,
              queueLength: seedData.queueLength,
              remainingLength: queue.length
            });

            console.log("iniciando");
            await this._saveTileFromUrl(queue.shift(), null).then(() => {
              console.log("terminou um");
            });

            console.log("continuando");
          }

          resolve();
        });
      },

      // Async'ly saves the tile as a PouchDB attachment
      // Will run the done() callback (if any) when finished.
      async _saveTileFromUrl(tileUrl, existingRevision) {
        return new Promise(async (resolve, reject) => {
          let blob = await fetch(tileUrl).then(async r => {
            r.clone()
              .blob()
              .then(async blob => {
                await this._db
                  .put({
                    _id: tileUrl,
                    _rev: existingRevision,
                    orthomosaicId: this.options.orthomosaicId,
                    timestamp: Date.now()
                  })
                  .then(async status => {
                    await this._db.putAttachment(
                      tileUrl,
                      "tile",
                      status.rev,
                      blob,
                      "image/png"
                    );
                    resolve();
                  })
                  .catch(err => {
                    // Saving the tile to the cache might have failed,
                    // but the tile itself has been loaded.
                    console.log("error on pouch put", err);
                    resolve();
                  });
              });
          });
        });
      },

      async _saveTileFromBlob(tileUrl, existingRevision, blob) {
        // console.log("saving tile: ", tileUrl, blob);
        return new Promise(async (resolve, reject) => {
          // this._db
          //   .upsert(tileUrl, function(doc) {
          //     return doc;
          //   })
          //   .then(async function(res) {
          //     await this._db.putAttachment(tileUrl, "tile", status.rev, blob, "image/png");
          //     resolve();
          //     // success, res is {rev: '1-xxx', updated: true, id: 'myDocId'}
          //   })
          //   .catch(function(err) {
          //     // error
          //     console.log("asdf", err);
          //     resolve();
          //   });
          // await this._db
          //   .put({
          //     _id: tileUrl,
          //     _rev: existingRevision,
          //     orthomosaicId: this.options.orthomosaicId,
          //     timestamp: Date.now()
          //   })
          //   .then(async status => {
          //     await this._db.putAttachment(tileUrl, "tile", status.rev, blob, "image/png");
          //     // console.log("pouch put done");
          //     resolve();
          //   })
          //   .catch(err => {
          //     // Saving the tile to the cache might have failed,
          //     // but the tile itself has been loaded.
          //     console.log("error on pouch put", err);
          //     resolve();
          //   });
          await this._db
            .put({
              _id: tileUrl,
              _rev: existingRevision,
              orthomosaicId: this.options.orthomosaicId,
              timestamp: Date.now()
            })
            .then(async status => {
              await this._db.putAttachment(
                tileUrl,
                "tile",
                status.rev,
                blob,
                "image/png"
              );
              // console.log("pouch put done");
              resolve();
            })
            .catch(async err => {
              // Saving the tile to the cache might have failed,
              // but the tile itself has been loaded.
              console.log("error on pouch put", err);
              resolve();
            });
        });
      },

      _createTile() {
        return document.createElement("img");
      },

      // Modified L.TileLayer.getTileUrl, this will use the zoom given by the parameter coords
      //  instead of the maps current zoomlevel.
      _getTileUrl(coords) {
        let zoom = coords.z;
        if (this.options.zoomReverse) {
          zoom = this.options.maxZoom - zoom;
        }
        zoom += this.options.zoomOffset;
        return L.Util.template(
          this._url,
          L.extend(
            {
              r:
                this.options.detectRetina &&
                L.Browser.retina &&
                this.options.maxZoom > 0
                  ? "@2x"
                  : "",
              s: this._getSubdomain(coords),
              x: coords.x,
              y: this.options.tms
                ? this._globalTileRange.max.y - coords.y
                : coords.y,
              z: this.options.maxNativeZoom
                ? Math.min(zoom, this.options.maxNativeZoom)
                : zoom
            },
            this.options
          )
        );
      },

      getMbTileBlob: function(coords) {
        // console.log("getting mb tile url");
        return new Promise(async (resolve, reject) => {
          var row = this._stmt.getAsObject({
            ":x": coords.x,
            // ":y": this._globalTileRange.max.y - coords.y,
            ":y": coords.y,
            ":z": coords.z
          });

          // console.log("row: ", row);

          if ("tile_data" in row) {
            resolve(new Blob([row.tile_data], { type: "image/png" }));
          } else {
            resolve(null);
          }
        });
      },

      getMbTileCount: function(coords) {
        return this._count[0].values[0][0];
      },

      _openDB: function(buffer) {
        // console.log("start load mbdb", buffer);
        try {
          /// This assumes the `SQL` global variable to exist!!
          this._MBdb = new SQL.Database(new Uint8Array(buffer));
          // console.log("MBdb: ", this._MBdb);
          this._stmt = this._MBdb.prepare(
            "SELECT tile_data FROM tiles WHERE zoom_level = :z AND tile_column = :x AND tile_row = :y"
          );
          this._count = this._MBdb.exec("SELECT COUNT() as count FROM tiles");

          // this._count = this._MBdb.prepare(
          //   "SELECT COUNT() as count FROM tiles"
          // );

          // console.log("stmt: ", this._stmt);

          // var row = this._stmt.getAsObject({
          //   ":x": coords.x,
          //   // ":y": this._globalTileRange.max.y - coords.y,
          //   ":y": coords.y,
          //   ":z": coords.z
          // });

          // Load some metadata (or at least try to)
          // var metaStmt = this._MBdb.prepare(
          //   "SELECT value FROM metadata WHERE name = :key"
          // );
          // var row;

          // row = metaStmt.getAsObject({ ":key": "attribution" });
          // if (row.value) {
          //   this.options.attribution = row.value;
          // }

          // row = metaStmt.getAsObject({ ":key": "minzoom" });
          // if (row.value) {
          //   this.options.minZoom = Number(row.value);
          // }

          // row = metaStmt.getAsObject({ ":key": "maxzoom" });
          // if (row.value) {
          //   this.options.maxZoom = Number(row.value);
          // }

          // row = metaStmt.getAsObject({ ":key": "format" });
          // if (row.value && row.value === "png") {
          //   this._format = "image/png";
          // } else if (row.value && row.value === "jpg") {
          //   this._format = "image/jpg";
          // } else {
          //   // Fall back to PNG, hope it works.
          //   this._format = "image/png";
          // }

          // 🍂event databaseloaded
          // Fired when the database has been loaded, parsed, and ready for queries
          this.fire("databaseloaded");
          this._databaseIsLoaded = true;
        } catch (ex) {
          console.log("fail load mbdb", ex);
          // 🍂event databaseloaded
          // Fired when the database could not load for any reason. Might contain
          // an `error` property describing the error.
          this.fire("databaseerror", { error: ex });
        }
      },

      // Uses a defined tile to eat through one item in the queue and
      //   asynchronously recursively call itself when the tile has
      //   finished loading.
      _seedOneTile(tile, remaining, seedData) {
        if (!remaining.length) {
          this.fire("seedend", seedData);
          return;
        }
        this.fire("seedprogress", {
          bbox: seedData.bbox,
          minZoom: seedData.minZoom,
          maxZoom: seedData.maxZoom,
          queueLength: seedData.queueLength,
          remainingLength: remaining.length
        });

        const url = remaining.shift();

        this._db.get(url, (err, data) => {
          console.log("url", url);
          console.log("err", err);
          console.log("data", data);
          if (!data) {
            console.log("nota data");
            // / FIXME: Do something on tile error!!
            tile.onload = function(ev) {
              this._saveTile(tile, url, null); // (ev)
              this._seedOneTile(tile, remaining, seedData);
            }.bind(this);
            tile.crossOrigin = "Anonymous";
            tile.src = url;
          } else {
            console.log("data");

            this._seedOneTile(tile, remaining, seedData);
          }
        });
      }
    });
  }
};
</script>

<style lang="scss" scoped></style>
