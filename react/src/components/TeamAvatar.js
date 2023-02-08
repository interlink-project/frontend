import {
  Avatar
} from '@mui/material';
import { People } from '@material-ui/icons';
import useMounted from 'hooks/useMounted';
import { useEffect, useState } from 'react';
import { teamsApi } from '__api__';

const TeamAvatar = ({ id = null, team = null, sx = {} }) => {
  const mounted = useMounted();
  const [data, setData] = useState(null);

  useEffect(() => {
    if (id && !team) {
      teamsApi.get(id).then((res) => {
        if (mounted.current) {
          setData(res.data);
        }
      });
    }
    if (team) {
      setData(team);
    }
  }, [id, team]);

  return data ? data.logotype_link ? (
    <Avatar
      title={data.name}
      src={data.logotype_link}
      sx={sx}
    />
  ) : (
    <People
      title={data.name}
      sx={sx}
    />
  ) : <></>;
};
export default TeamAvatar;
