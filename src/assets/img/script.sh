# #!/bin/bash

# for file in ./*.jpg; do
#     filename=$(basename "$file")
#     fname="${filename%.*}"
#     convert "$filename" -quality 50 "jp2/$fname.jp2"
# done

# for file in ./*.png; do
#     filename=$(basename "$file")
#     fname="${filename%.*}"
#     convert "$filename" -quality 50 "jp2/$fname.jp2"
# done

# for file in ./*.jpg; do
#     filename=$(basename "$file")
#     fname="${filename%.*}"
#     convert "$filename" -quality 50 "webp/$fname.webp"
# done

# for file in ./*.png; do
#     filename=$(basename "$file")
#     fname="${filename%.*}"
#     convert "$filename" -quality 50 "webp/$fname.webp"
# done

# for file in ./*.jpg; do
#     filename=$(basename "$file")
#     fname="${filename%.*}"
#     convert "$filename" -quality 50 "jxr/$fname.jxr"
# done

for file in ./*.png; do
    filename=$(basename "$file")
    fname="${filename%.*}"
    convert "./$filename" -quality 50 "bmp/$fname.bmp"
    JxrEncApp -i "./bmp/$fname.bmp" -o "jxr/$fname.jxr"
done

# ===

# for file in ./cards/*.jpg; do
#     filename=$(basename "$file")
#     fname="${filename%.*}"
#     convert "./cards/$filename" -quality 50 "jp2/cards/$fname.jp2"
# done

# for file in ./cards/*.png; do
#     filename=$(basename "$file")
#     fname="${filename%.*}"
#     convert "./cards/$filename" -quality 50 "jp2/cards/$fname.jp2"
# done

# for file in ./cards/*.jpg; do
#     filename=$(basename "$file")
#     fname="${filename%.*}"
#     convert "./cards/$filename" -quality 50 "webp/cards/$fname.webp"
# done

# for file in ./cards/*.png; do
#     filename=$(basename "$file")
#     fname="${filename%.*}"
#     convert "./cards/$filename" -quality 50 "webp/cards/$fname.webp"
# done

# for file in ./cards/*.jpg; do
#     filename=$(basename "$file")
#     fname="${filename%.*}"
#     convert "./cards/$filename" -quality 50 "jxr/cards/$fname.jxr"
# done

for file in ./cards/*.png; do
    filename=$(basename "$file")
    fname="${filename%.*}"
    convert "./cards/$filename" -quality 50 "bmp/cards/$fname.bmp"
    JxrEncApp -i "./bmp/cards/$fname.bmp" -o "jxr/cards/$fname.jxr"
done

# ===

# for file in ./workers/*.jpg; do
#     filename=$(basename "$file")
#     fname="${filename%.*}"
#     convert "./workers/$filename" -quality 50 "jp2/workers/$fname.jp2"
# done

# for file in ./workers/*.png; do
#     filename=$(basename "$file")
#     fname="${filename%.*}"
#     convert "./workers/$filename" -quality 50 "jp2/workers/$fname.jp2"
# done

# for file in ./workers/*.jpg; do
#     filename=$(basename "$file")
#     fname="${filename%.*}"
#     convert "./workers/$filename" -quality 50 "webp/workers/$fname.webp"
# done

# for file in ./workers/*.png; do
#     filename=$(basename "$file")
#     fname="${filename%.*}"
#     convert "./workers/$filename" -quality 50 "webp/workers/$fname.webp"
# done

# for file in ./workers/*.jpg; do
#     filename=$(basename "$file")
#     fname="${filename%.*}"
#     convert "./workers/$filename" -quality 50 "jxr/workers/$fname.jxr"
# done

for file in ./workers/*.png; do
    filename=$(basename "$file")
    fname="${filename%.*}"
    convert "./workers/$filename" -quality 50 "bmp/workers/$fname.bmp"
    JxrEncApp -i "./bmp/workers/$fname.bmp" -o "jxr/workers/$fname.jxr"
done

# # ===

# for file in ./logo/*.jpg; do
#     filename=$(basename "$file")
#     fname="${filename%.*}"
#     convert "./logo/$filename" -quality 50 "jp2/logo/$fname.jp2"
# done

# for file in ./logo/*.png; do
#     filename=$(basename "$file")
#     fname="${filename%.*}"
#     convert "./logo/$filename" -quality 50 "jp2/logo/$fname.jp2"
# done

# for file in ./logo/*.jpg; do
#     filename=$(basename "$file")
#     fname="${filename%.*}"
#     convert "./logo/$filename" -quality 50 "webp/logo/$fname.webp"
# done

# for file in ./logo/*.png; do
#     filename=$(basename "$file")
#     fname="${filename%.*}"
#     convert "./logo/$filename" -quality 50 "webp/logo/$fname.webp"
# done

# for file in ./logo/*.jpg; do
#     filename=$(basename "$file")
#     fname="${filename%.*}"
#     convert "./logo/$filename" -quality 50 "jxr/logo/$fname.jxr"
# done

for file in ./logo/*.png; do
    filename=$(basename "$file")
    fname="${filename%.*}"
    convert "./logo/$filename" -quality 50 "bmp/logo/$fname.bmp"
    JxrEncApp -i "./bmp/logo/$fname.bmp" -o "jxr/logo/$fname.jxr"
done

# ===

# for file in ./partners/*.jpg; do
#     filename=$(basename "$file")
#     fname="${filename%.*}"
#     convert "./partners/$filename" -quality 50 "jp2/partners/$fname.jp2"
# done

# for file in ./partners/*.png; do
#     filename=$(basename "$file")
#     fname="${filename%.*}"
#     convert "./partners/$filename" -quality 50 "jp2/partners/$fname.jp2"
# done

# for file in ./partners/*.jpg; do
#     filename=$(basename "$file")
#     fname="${filename%.*}"
#     convert "./partners/$filename" -quality 50 "webp/partners/$fname.webp"
# done

# for file in ./partners/*.png; do
#     filename=$(basename "$file")
#     fname="${filename%.*}"
#     convert "./partners/$filename" -quality 50 "webp/partners/$fname.webp"
# done

# for file in ./partners/*.jpg; do
#     filename=$(basename "$file")
#     fname="${filename%.*}"
#     convert "./partners/$filename" -quality 50 "jxr/partners/$fname.jxr"
# done

for file in ./partners/*.png; do
    filename=$(basename "$file")
    fname="${filename%.*}"
    convert "./partners/$filename" -quality 50 "bmp/partners/$fname.bmp"
    JxrEncApp -i "./bmp/partners/$fname.bmp" -o "jxr/partners/$fname.jxr"
done






