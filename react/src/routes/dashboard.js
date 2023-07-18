import AuthGuard from 'components/guards/AuthGuard';
import { lazy } from 'react';
import DashboardLayout from 'components/layouts/DashboardLayout';
import Loadable from './Loadable';
import OrganizationProfileSolo from 'components/dashboard/organizations/OrganizationProfileSolo';
import StoryLayout from 'components/layouts/StoryLayout';
import RedirectProcessAsset from 'pages/dashboard/coproductionprocesses/RedirectProcessAsset';
import PublicCoproductionLayout from 'components/layouts/PublicCoproductionLayout';
import PublicCoproductionCatalogue from 'pages/dashboard/publiccoproductions/PublicCoproductionCatalogue';
import PublicCoproductionProfile from 'pages/dashboard/publiccoproductions/PublicCoproductionProfile';
import CatalogueSelector from 'components/dashboard/CatalogueSelector';
import SucessfullClaimRegistration from 'pages/dashboard/assignments/sucessfullClaimRegistration';


const CoproductionProcessProfile = Loadable(
  lazy(() => import('../pages/dashboard/coproductionprocesses/CoproductionProcessProfile'))
);
const StoryProfile = Loadable(
  lazy(() => import('../pages/dashboard/stories/StoryProfile'))
);
const Settings = Loadable(
  lazy(() => import('../pages/dashboard/settings/index'))
);
const Catalogue = Loadable(
  lazy(() => import('../pages/dashboard/interlinkers/Catalogue'))
);

const SuccessCatalogue = Loadable(
  lazy(() => import('../pages/dashboard/stories/SucessCatalogue'))
);

const InterlinkerProfile = Loadable(
  lazy(() => import('../components/dashboard/interlinkers/profile/InterlinkerProfile'))
);
const Organizations = Loadable(
  lazy(() => import('../pages/dashboard/organizations/index'))
);
const AssignmentsClaim = Loadable(
  lazy(() => import('../pages/dashboard/assignments/newassignationclaim'))
);
const OrganizationProfile = Loadable(
  lazy(() => import('../components/dashboard/organizations/OrganizationProfile'))
);
const Workspace = Loadable(lazy(() => import('../pages/dashboard/workspace')));
const WelcomeView = Loadable(lazy(() => import('../pages/dashboard/workspace/ProjectsOverview')));

export const routes = [
  {
    path: 'publiccoproductions',
    element: (
      <PublicCoproductionLayout />
    ),
    children: [
      {
        path: '',
        element: <PublicCoproductionCatalogue />,
      },
      {
        path: ':processId',
        children: [
          {
            path: '',
            element: <PublicCoproductionProfile />
            ,
          },
          {
            path: ':tab',
            element: <PublicCoproductionProfile />
          },
          {
            path: 'apply',
            element: <AuthGuard><PublicCoproductionProfile /></AuthGuard>
          },
          
        ]
      }
    ]
    },
  {
    path: 'stories',
    element: (
      <StoryLayout />
    ),
    children: [
      {
        path: '',
        element: <SuccessCatalogue />,
      },
      {
        path: ':processId',
        children: [
          {
            path: '',
            element: <AuthGuard><StoryProfile /></AuthGuard>
            ,
          },
          {
            path: ':tab',
            element: <AuthGuard><StoryProfile /></AuthGuard>
          },
        ]
      }
    ]
    },
  {
    path: 'dashboard',
    element: (
      <DashboardLayout />
    ),
    children: [
      {
        path: '',
        element: <Workspace />,
      },
      {
        path: 'projects',
        element: <WelcomeView />,
      },
      {
        path: 'settings',
        element: <Settings />,
      },
      {
        path: 'coproductionprocesses/:processId',
        children: [
          {
            path: '',
            element: <AuthGuard><CoproductionProcessProfile /></AuthGuard>
            ,
          },
          {
            path: ':tab',
            element: <AuthGuard><CoproductionProcessProfile /></AuthGuard>
          },
        ]
      },
      {
        path: 'coproductionprocesses/:processId/:treeitemId/guide',
        children: [
          {
            path: '',
            element: <AuthGuard><CoproductionProcessProfile /></AuthGuard>
            ,
          },
          {
            path: ':tab',
            element: <AuthGuard><CoproductionProcessProfile /></AuthGuard>
          },
        ]
      },
      {
        path: 'coproductionprocesses/:processId/:assetId/view',
        children: [
          {
            path: '',
            element: <AuthGuard><RedirectProcessAsset /></AuthGuard>
            ,
          }
        ]
      },
      {
        path: 'interlinkers',
        children: [
          {
            path: '',
            element: <CatalogueSelector />,
          },
          {
            path: ':interlinkerId',
            element: <InterlinkerProfile />,
          },
        ],
      },
      {
      
        path: 'organizations',
        children: [
          {
            path: '',
            element: <Organizations />,
          },
          {
            path: ':organizationIdPage',
            element: <OrganizationProfileSolo />,
          },
          {
            path: ':organizationIdPage/:teamId',
            element: <OrganizationProfileSolo />,
          }
        ],
      },
      {
      
        path: 'assignments',
        children: [
          {
            path: 'success',
            element: <SucessfullClaimRegistration />,
          },
          {
            path: 'registerclaim/:assignmentIdPage',
            element: <AssignmentsClaim />,
          }
        ],
      }
    ],

  },

];
