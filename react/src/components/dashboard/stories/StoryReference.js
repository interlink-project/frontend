import { Avatar, Link, Skeleton, Stack } from '@mui/material';
import useMounted from 'hooks/useMounted';
import { useEffect, useState } from 'react';
//import { storiesApi } from '__api__';

const StoryReference = ({ story_id, onClick = () => { } }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const mounted = useMounted();

  useEffect(() => {
    // storiesApi.get(interlinker_id).then((res) => {
    //   if (mounted.current) {
    //     setData(res);
    //     setLoading(false);
    //   }
    // });

    const dataStories=[{
      id:'1',
      title:'Coproduce a Hackaton',
      name:'Hackaton',
      description:'Story description',
      isLiked:false,
      likes:0,
      logotype_link:'/static/coproductionprocesses/47c40b06-2147-440b-8f08-fac9e976af38.png',
      updated_at:'2021-08-23',
      created_at:'2021-08-23',
      rating:10,
      tags:['salud','dinero','amor']

    }]


  setData(dataStories);



    //setData([]);
    setLoading(false);
  }, []);

  return loading || !data ? <Skeleton /> : (
    <Stack
      direction='row'
      alignItems='center'
      spacing={1}
    >
      {data.logotype_link && (
      <Avatar
        src={data.logotype_link}
        sx={{ height: '20px', width: '20px' }}
      />
      )}
      <Link
        color='primary'
        onClick={onClick}
        underline='none'
      >
        {data.name}
      </Link>
    </Stack>
  );
};

export default StoryReference;
