import { useCallback, useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { formatDistanceToNowStrict, subDays, subHours, subMinutes } from 'date-fns';
import {
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Tab,
  Tabs,
  Typography,
} from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import { interlinkersApi } from '__fakeApi__';
import {
  InterlinkerActivities,
  InterlinkerApplicants,
  InterlinkerApplicationModal,
  InterlinkerAssets,
  InterlinkerOverview,
  InterlinkerReviews,
} from 'components/dashboard/interlinkers';
import useMounted from 'hooks/useMounted';
import useSettings from 'hooks/useSettings';
import ShareIcon from 'icons/Share';
import gtm from 'lib/gtm';
import { useParams } from 'react-router-dom';
import { getImageUrl } from 'axiosInstance';
import Markdown from 'react-markdown/with-html';
import { experimentalStyled } from '@material-ui/core/styles';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import dracula from 'react-syntax-highlighter/dist/cjs/styles/prism/dracula';

const now = new Date();


const MarkdownWrapper = experimentalStyled('div')(({ theme }) => ({
  color: theme.palette.text.primary,
  fontFamily: theme.typography.fontFamily,
  '& blockquote': {
    borderLeft: `4px solid ${theme.palette.text.secondary}`,
    marginBottom: theme.spacing(2),
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    paddingTop: theme.spacing(1),
    '& > p': {
      color: theme.palette.text.secondary,
      marginBottom: 0
    }
  },
  '& code': {
    color: '#01ab56',
    fontFamily: 'Inconsolata, Monaco, Consolas, \'Courier New\', Courier, monospace',
    fontSize: 14,
    paddingLeft: 2,
    paddingRight: 2
  },
  '& h1': {
    fontSize: 35,
    fontWeight: 500,
    letterSpacing: '-0.24px',
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(6)
  },
  '& h2': {
    fontSize: 29,
    fontWeight: 500,
    letterSpacing: '-0.24px',
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(6)
  },
  '& h3': {
    fontSize: 24,
    fontWeight: 500,
    letterSpacing: '-0.06px',
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(6)
  },
  '& h4': {
    fontSize: 20,
    fontWeight: 500,
    letterSpacing: '-0.06px',
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(4)
  },
  '& h5': {
    fontSize: 16,
    fontWeight: 500,
    letterSpacing: '-0.05px',
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(2)
  },
  '& h6': {
    fontSize: 14,
    fontWeight: 500,
    letterSpacing: '-0.05px',
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(2)
  },
  '& li': {
    fontSize: 14,
    lineHeight: 1.5,
    marginBottom: theme.spacing(2),
    marginLeft: theme.spacing(4)
  },
  '& p': {
    fontSize: 14,
    lineHeight: 1.5,
    marginBottom: theme.spacing(2),
    '& > a': {
      color: theme.palette.secondary.main
    }
  }
}));

const renderers = {
  link: (props) => {
    const { href, children, ...other } = props;

    if (!href.startsWith('http')) {
      return (
        <a
          href={href}
          {...other}
        >
          {children}
        </a>
      );
    }

    return (
      <a
        href={href}
        rel='nofollow noreferrer noopener'
        target='_blank'
        {...other}
      >
        {children}
      </a>
    );
  },
  code: (props) => {
    const { language, value, ...other } = props;

    return (
      <SyntaxHighlighter
        language={language}
        style={dracula}
        {...other}
      >
        {value}
      </SyntaxHighlighter>
    );
  }
};


const tabs = [
  { label: 'Overview', value: 'overview' },
  { label: 'Documentation', value: 'documentation' },
  { label: 'Assets', value: 'assets' },
  { label: 'Reviews', value: 'reviews' },
  { label: 'Activity', value: 'activity' },
  { label: 'Applicants', value: 'applicants' },
];

const InterlinkerDetails = () => {
  const mounted = useMounted();
  const { settings } = useSettings();
  const [currentTab, setCurrentTab] = useState('overview');
  const [interlinker, setInterlinker] = useState(null);
  const [isApplicationOpen, setIsApplicationOpen] = useState(false);

  const params = useParams()

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  const getInterlinker = useCallback(async () => {
    try {
      const data = await interlinkersApi.get(params.interlinkerId);

      if (mounted.current) {
        setInterlinker(data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [mounted]);

  useEffect(() => {
    getInterlinker();
  }, [getInterlinker]);

  const handleApplyModalOpen = () => {
    setIsApplicationOpen(true);
  };

  const handleApplyModalClose = () => {
    setIsApplicationOpen(false);
  };

  const handleTabsChange = (event, value) => {
    setCurrentTab(value);
  };

  if (!interlinker) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Dashboard: Interlinker Details</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          <Grid
            container
            justifyContent='center'
            alignItems='center'
            spacing={3}
          >
              <Avatar
                alt='Logotype'
                src={getImageUrl("catalogue", interlinker.logotype)}
                variant='square'
              >
                {interlinker.name}
              </Avatar>
              <Box sx={{ ml: 2 }}>
                <Typography
                  color='textPrimary'
                  variant='h5'
                >
                  {interlinker.name}
                </Typography>
              </Box>
              <Box>
                <Button
                  color='primary'
                  startIcon={<ShareIcon fontSize='small' />}
                  sx={{ m: 1 }}
                  variant='text'
                >
                  Share
                </Button>
              </Box>
          </Grid>
          <Box sx={{ mt: 3 }}>
            <Tabs
              indicatorColor='primary'
              onChange={handleTabsChange}
              scrollButtons='auto'
              textColor='primary'
              value={currentTab}
              centered
            >
              {tabs.map((tab) => (
                <Tab
                  key={tab.value}
                  label={tab.label}
                  value={tab.value}
                />
              ))}
            </Tabs>
          </Box>
          <Divider />
          <Box sx={{ mt: 3}} >
            {currentTab === 'overview' && (
              <InterlinkerOverview interlinker={interlinker} />
            )}
            {currentTab === 'documentation' && (
              <MarkdownWrapper>
              <Markdown
                escapeHtml
                renderers={renderers}
                source={interlinker.documentation}
              />
            </MarkdownWrapper>
            )}
            {currentTab === 'assets' && (
              <InterlinkerAssets interlinker={interlinker} />
            )}
            {currentTab === 'reviews' && (
              <InterlinkerReviews reviews={[
                {
                  id: '5f0366cd843161f193ebadd4',
                  author: {
                    avatar: '/static/mock-images/avatars/avatar-marcus_finn.png',
                    name: 'Marcus Finn',
                  },
                  comment: 'Great company, providing an awesome & easy to use product.',
                  createdAt: subHours(now, 2).getTime(),
                  value: 5,
                },
                {
                  id: 'to33twsyjphcfj55y3t07261',
                  author: {
                    avatar: '/static/mock-images/avatars/avatar-miron_vitold.png',
                    name: 'Miron Vitold',
                  },
                  comment:
                    "Not the best people managers, poor management skills, poor career development programs. Communication from corporate & leadership isn't always clear and is sometime one-sided. Low pay compared to FANG.",
                  createdAt: subHours(now, 2).getTime(),
                  value: 2,
                },
                {
                  id: '6z9dwxjzkqbmxuluxx2681jd',
                  author: {
                    avatar: '/static/mock-images/avatars/avatar-carson_darrin.png',
                    name: 'Carson Darrin',
                  },
                  comment:
                    'I have been working with this company full-time. Great for the work life balance. Cons, decentralized decision making process across the organization.',
                  createdAt: subHours(now, 2).getTime(),
                  value: 4,
                },
              ]} />
            )}
            {currentTab === 'activity' && (
              <InterlinkerActivities activities={[
                {
                  id: '5e8dd0828d628e6f40abdfe8',
                  createdAt: subMinutes(now, 23).getTime(),
                  description: 'has uploaded a new file',
                  subject: 'Interlinker author',
                  type: 'upload_file',
                },
                {
                  id: '5e8dd0893a6725f2bb603617',
                  createdAt: subHours(now, 2).getTime(),
                  description: 'joined team as a Front-End Developer',
                  subject: 'Adrian Stefan',
                  type: 'join_team',
                },
                {
                  id: '5e8dd08f44603e3300b75cf1',
                  createdAt: subHours(now, 9).getTime(),
                  description: 'joined team as a Full Stack Developer',
                  subject: 'Alexndru Robert',
                  type: 'join_team',
                },
                {
                  id: '5e8dd0960f3f0fe04e64d8f4',
                  createdAt: subDays(now, 2).getTime(),
                  description: 'raised the interlinker budget',
                  subject: 'Interlinker author',
                  type: 'price_change',
                },
                {
                  id: '5e8dd09db94421c502c53d13',
                  createdAt: subDays(now, 4).getTime(),
                  description: 'created',
                  subject: 'Contest',
                  type: 'contest_created',
                },
              ]} />
            )}
            {currentTab === 'applicants' && (
              <InterlinkerApplicants applicants={[
                {
                  id: '5e887a62195cc5aef7e8ca5d',
                  avatar: '/static/mock-images/avatars/avatar-marcus_finn.png',
                  commonConnections: 12,
                  cover: '/static/mock-images/covers/cover_2.jpg',
                  name: 'Marcus Finn',
                  skills: [
                    'User Experience',
                    'FrontEnd development',
                    'HTML5',
                    'VueJS',
                    'ReactJS',
                  ],
                },
                {
                  id: '5e887ac47eed253091be10cb',
                  avatar: '/static/mock-images/avatars/avatar-carson_darrin.png',
                  commonConnections: 5,
                  cover: '/static/mock-images/covers/cover_3.jpg',
                  name: 'Carson Darrin',
                  skills: [
                    'User Interface',
                    'FullStack development',
                    'Angular',
                    'ExpressJS',
                  ],
                },
                {
                  id: '5e86809283e28b96d2d38537',
                  avatar: '/static/mock-images/avatars/avatar-jane_rotanson.png',
                  commonConnections: 17,
                  cover: '/static/mock-images/covers/cover_1.jpg',
                  name: 'Jane Rotanson',
                  skills: ['BackEnd development', 'Firebase', 'MongoDB', 'ExpressJS'],
                },
              ]} />
            )}
          </Box>
        </Container>
      </Box>
      {/* <InterlinkerApplicationModal
        authorAvatar={interlinker.author.avatar}
        authorName={interlinker.author.name}
        onApply={handleApplyModalClose}
        onClose={handleApplyModalClose}
        open={isApplicationOpen}
      />*/}

    </>
  );
};

export default InterlinkerDetails;
