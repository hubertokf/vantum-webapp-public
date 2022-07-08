import Vue from "vue";
import Router from "vue-router";
import store from "@/store";
import loadState from '@/store/loadState'
import Hotsite from "@/views/Hotsite";
import Landing from "@/views/Landing";
import Login from "@/views/Login";
import Signup from "@/views/Signup";
import SignupPro from "@/views/SignupPro";
import SignupCompany from "@/views/SignupCompany";
import SignupForm from "@/components/Signup.form";
import SignupSuccess from "@/components/Signup.success";
import ForgotPassword from "@/views/ForgotPassword";
import UpdatePassword from "@/views/UpdatePassword";
import EmailConfirmation from "@/views/EmailConfirmation";
// import Project from '@/components/Project.form'

import App from "@/views/App";
import List from "@/components/app/List";
import CompanyView from "@/views/Company";
import NotFoundComponent from "@/views/404-NotFound";

import ExampleList from "@/components/app/example/ExampleList";

import UserConfig from "@/components/app/config/UserConfig";
import CompanyConfig from "@/components/app/config/CompanyConfig";

import Project from "@/components/app/project/Project";
import NewProject from "@/components/app/project/NewProject";
import ProjectForm from "@/components/app/project/ProjectForm";
import ProjectList from "@/components/app/project/ProjectList";
import InsertProjectList from "@/components/app/project/InsertProjectList";

import Plan from "@/components/app/plan/Plan";
import NewPlan from "@/components/app/plan/NewPlan";
import PlanList from "@/components/app/plan/PlanList";
import PlanForm from "@/components/app/plan/PlanForm";
import InsertPlanList from "@/components/app/plan/InsertPlanList";

import AlbumList from "@/components/app/album/AlbumList";
import NewAlbum from "@/components/app/album/NewAlbum";
import AlbumForm from "@/components/app/album/AlbumForm";

import OrthomosaicForm from "@/components/app/orthomosaic/OrthomosaicForm";

import SharingList from "@/components/app/share/SharingList";
import Sharing from "@/components/app/share/Sharing";

import ListsView from "@/components/app/ListsView";
import BillingView from "@/components/app/billing/BillingView";

import Annotation from "@/components/app/annotation/Annotation";

import LoginAsUser from "@/views/LoginAsUser";

import FileUpload from "@/components/app/FileUpload";

import Terms from "@/views/Terms";

import Album from "@/components/app/album/Album";

import IdeaResearchCampaign from "@/views/campaigns/IdeaResearchCampaign";

Vue.use(Router);

let router = new Router({
  mode: "history",
  routes: [{
      path: "/termos",
      name: "Terms",
      component: Terms,

      meta: {
        title: "Termos",
        requiresAuth: false,
        fullpage: false
      }
    },
    {
      path: "/signup/company",
      name: "SignupCompany",
      props: true,
      component: SignupCompany,

      meta: {
        title: "Cadastro Empresarial - Vantum",
        requiresAuth: false,
        fullpage: true
      }
    },
    {
      path: "/signup/company/success",
      name: "SignupCompanySuccess",
      props: true,
      component: SignupCompany,

      meta: {
        title: "Cadastro Empresarial - Vantum",
        requiresAuth: false,
        fullpage: true
      }
    },
    {
      path: "/login/:confirmation?",
      name: "Login",
      component: Login,

      meta: {
        title: "Login - Vantum",
        fullpage: true
      }
    },
    {
      path: "/loginasuser/:token?",
      name: "LoginAsUser",
      component: LoginAsUser,

      meta: {
        title: "Vantum",
        requiresAuth: false,
        fullpage: true
      }
    },
    {
      path: "/emailconfirmation",
      name: "EmailConfirmation",
      component: EmailConfirmation,

      meta: {
        title: "Confirmação de Email - Vantum",
        fullpage: true
      }
    },
    {
      path: "/forgotpassword",
      name: "ForgotPassword",
      component: ForgotPassword,

      meta: {
        title: "Recuperar Senha - Vantum",
        requiresAuth: false,
        fullpage: true
      }
    },
    {
      path: "/updatepassword/:token?",
      name: "UpdatePassword",
      component: UpdatePassword,

      meta: {
        title: "Atualizar Senha - Vantum",
        requiresAuth: false,
        fullpage: true
      }
    },
    {
      path: "/signup",
      name: "Signup",
      props: true,
      component: Signup,

      meta: {
        title: "Cadastro - Vantum",
        requiresAuth: false,
        fullpage: true
      },
      children: [{
          path: "/",
          name: "SignupForm",
          props: true,
          component: SignupForm,
          meta: {
            title: "Cadastro - Vantum",
            requiresAuth: false,
            fullpage: true
          }
        },
        {
          path: "success",
          name: "SignupSuccess",
          props: true,
          component: SignupSuccess,
          meta: {
            title: "Cadastro finalizado - Vantum",
            requiresAuth: false,
            fullpage: true
          }
        }
      ]
    },
    {
      path: "/",
      name: "App",
      component: App,
      redirect: {
        name: "List"
      },
      meta: {
        title: "Vantum App",
        requiresAuth: false,
        fullpage: true
      },
      children: [{
          path: "config",
          name: "UserConfig",
          props: true,
          component: UserConfig,
          meta: {
            title: "Configuração - Vantum App",
            requiresAuth: true,
            fullpage: true
          }
        },
        {
          path: "config/company",
          name: "CompanyConfig",
          props: true,
          component: CompanyConfig,
          meta: {
            title: "Configuração - Vantum App",
            requiresAuth: true,
            fullpage: true
          }
        },
        {
          path: "sharing/:shareId",
          name: "Sharing",
          props: true,
          component: Sharing,
          meta: {
            title: "Compartilhamento - Vantum App",
            requiresAuth: false,
            fullpage: true
          }
        },
        {
          path: "/",
          name: "List",
          component: List,
          // redirect: {
          //   name: "ProjectList"
          // },
          meta: {
            title: "Vantum App",
            requiresAuth: true,
            fullpage: true
          },
        },
        {
          path: "examples",
          name: "ExampleList",
          component: ExampleList,
          meta: {
            title: "Exemplos - Vantum App",
            requiresAuth: true,
            fullpage: true
          }
        },
        {
          path: "projects",
          name: "ProjectList",
          component: ProjectList,
          meta: {
            title: "Lista de Projetos - Vantum App",
            requiresAuth: true,
            fullpage: true
          }
        },
        {
          path: "annotation/:annotationId",
          name: "Annotation",
          component: Annotation,
          props: true,
          meta: {
            title: "Anotação - Vantum App",
            requiresAuth: true,
            fullpage: true
          }
        },
        {
          path: "projects/new",
          component: NewProject,
          props: true,
          name: "NewProject",
          meta: {
            title: "Nova Pasta - Vantum App",
            requiresAuth: true,
            fullpage: true
          },
          children: [{
              path: "/",
              name: "ProjectForm",
              component: ProjectForm,
              props: true,
              meta: {
                requiresAuth: true,
                fullpage: true
              }
            },
            {
              path: "plan",
              name: "ProjectPlanForm",
              component: PlanForm,
              props: true,
              meta: {
                requiresAuth: true,
                fullpage: true
              }
            },
            {
              path: "album",
              name: "ProjectAlbumForm",
              props: true,
              component: AlbumForm,
              meta: {
                requiresAuth: true,
                fullpage: true
              }
            },
            {
              path: "orthomosaic",
              name: "ProjectOrthomosaicForm",
              props: true,
              component: OrthomosaicForm,
              meta: {
                requiresAuth: true,
                fullpage: true
              }
            }
          ]
        },
        {
          path: "project/:projectId",
          name: "Project",
          component: Project,
          props: true,
          meta: {
            title: "Projeto - Vantum App",
            requiresAuth: true,
            fullpage: true
          }
        },
        {
          path: "project/:projectId/insert-project",
          name: "InsertProjectList",
          component: InsertProjectList,
          props: true,
          meta: {
            title: "Inserir Projeto - Vantum App",
            requiresAuth: true,
            fullpage: true
          },
          children: [{
            path: "newProject",
            name: "NewProjectToInsert",
            component: ProjectForm,
            props: true,
            meta: {
              title: "Nova Pasta - Vantum App",
              requiresAuth: true,
              fullpage: true
            }
          }]
        },
        {
          path: "project/:projectId/insert-plan",
          name: "InsertPlanList",
          component: InsertPlanList,
          props: true,
          meta: {
            title: "Inserir Mapa - Vantum App",
            requiresAuth: true,
            fullpage: true
          }
        },

        {
          path: "project/:projectId/addplan",
          name: "AddPlan",
          component: NewPlan,
          props: true,
          meta: {
            title: "Adicionar Mapa - Projeto - Vantum App",
            requiresAuth: true,
            fullpage: true
          }
        },
        {
          path: "plan/:planId",
          name: "Plan",
          component: Plan,
          props: true,
          meta: {
            title: "Mapa - Vantum App",
            requiresAuth: true,
            fullpage: true
          }
        },
        {
          path: "plans",
          name: "PlanList",
          component: PlanList,
          meta: {
            title: "Lista de Mapas - Vantum App",
            requiresAuth: true,
            fullpage: true
          }
        },
        {
          path: "plans/new",
          component: NewPlan,
          name: "NewPlan",
          props: true,
          meta: {
            title: "Novo Mapa - Vantum App",
            requiresAuth: true,
            fullpage: true
          },
          children: [{
              path: "/",
              name: "PlanForm",
              component: PlanForm,
              props: true,
              meta: {
                requiresAuth: true,
                fullpage: true
              }
            },
            {
              path: "album",
              name: "PlanAlbumForm",
              props: true,
              component: AlbumForm,
              meta: {
                requiresAuth: true,
                fullpage: true
              }
            },
            {
              path: "orthomosaic",
              name: "PlanOrthomosaicForm",
              props: true,
              component: OrthomosaicForm,
              meta: {
                requiresAuth: true,
                fullpage: true
              }
            }
          ]
        },
        {
          path: "album/:albumId",
          name: "Album",
          component: Album,
          props: true,
          meta: {
            title: "Album - Vantum App",
            requiresAuth: true,
            fullpage: true
          }
        },
        {
          path: "albums",
          name: "AlbumList",
          component: AlbumList,
          meta: {
            title: "Lista de Albums - Vantum App",
            requiresAuth: true,
            fullpage: true
          }
        },
        {
          path: "albums/new",
          name: "NewAlbum",
          component: NewAlbum,
          meta: {
            title: "Novo Album - Vantum App",
            requiresAuth: true,
            fullpage: true
          }
        },
        {
          path: "sharing",
          name: "SharingList",
          component: SharingList,
          meta: {
            title: "Lista de Compartilhamentos - Vantum App",
            requiresAuth: true,
            fullpage: true
          }
        },
        {
          path: "project/:projectId/billing",
          name: "ProjectBilling",
          component: BillingView,
          props: true,
          meta: {
            title: "Pagamento - Projeto - Vantum App",
            requiresAuth: true,
            fullpage: true
          }
        },
        {
          path: "plan/:planId/billing",
          name: "PlanBilling",
          component: BillingView,
          props: true,
          meta: {
            title: "Pagamento - Mapa - Vantum App",
            requiresAuth: true,
            fullpage: true
          }
        },
      ]
    },
    {
      path: "*",
      name: "404NotFound",
      component: NotFoundComponent,
      meta: {
        fullpage: true
      }
    }
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (about.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () =>
    //     import('@/views/Landing.vue')
    // }
  ]
});

router.beforeEach((to, from, next) => {
  loadState();

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (store.getters.isLoggedIn) {
      next();
      return;
    }
    next({
      path: "/login",
      query: {
        nextUrl: to.fullPath
      }
    });
  }

  const nearestWithTitle = to.matched
    .slice()
    .reverse()
    .find(r => r.meta && r.meta.title);

  if (nearestWithTitle) document.title = nearestWithTitle.meta.title;

  next();
});

export default router;