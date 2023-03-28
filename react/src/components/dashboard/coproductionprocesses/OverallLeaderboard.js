import {
  AppBar,
  Box,
  Paper,
  Tab,
  Tabs,
  Grid,
  Card,
  CardContent,
  Container,
  Typography,
  CardMedia,
  Button,
  Divider,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import UserAvatar from "components/UserAvatar";
import LeaderboardOutlinedIcon from "@mui/icons-material/LeaderboardOutlined";

const OverallLeaderboard = ({ users }) => {
  const [orderedUsers, setOrderedUsers] = useState([]);
  const [rows, setRows] = useState([]);

  const columns = [
    {
      field: "position",
      width: 90,
      renderHeader: () => <LeaderboardOutlinedIcon />,
      sortable: false,
      disableColumnMenu: true,
      flex: 0.2,
    },
    {
      field: "collab_name",
      headerName: "Collaborator name",
      width: 150,
      sortable: false,
      disableColumnMenu: true,
      flex: 2,
    },
    {
      field: "team",
      headerName: "Team",
      sortable: false,
      disableColumnMenu: true,
      flex: 2,
    },
    {
      field: "location",
      headerName: "Location",
      sortable: false,
      disableColumnMenu: true,
      flex: 1,
    },
    {
      field: "points",
      headerName: "Points",
      sortable: false,
      disableColumnMenu: true,
      flex: 0.5,
    },
  ];

  const handleRows = () => {
    let tmpRows = [];
    console.log(users);
    for (let i = 3; i < users.length; i++) {
      tmpRows.push({
        id: users[i].id,
        position: i,
        collab_name: users[i].name,
        team: "test",
        location: "test",
        points: users[i].score,
      });
    }
    setRows(tmpRows);
    console.log(rows);
  };

  useEffect(() => {
    if (users.length > 0) {
      orderUsers();
      console.log(users);
      if (users.length > 3) {
        handleRows();
      }
    }
  }, [users]);

  const orderUsers = () => {
    setOrderedUsers(users.sort((a, b) => b.score > a.score));
  };

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6} lg={6}>
          <Typography variant="h3" component="h2" gutterBottom>
            Leaderboard
          </Typography>
          <Typography variant="body1" gutterBottom>
            Here you can see the overall standings. The amount of points is
            based on your contribute in each finished task, decided by the
            admins. At the end of the project the admin will decide who can be
            rewarded,{" "}
            <b>
              the podium is only to show who is giving more contribute into the
              project
            </b>
            . The reward is external from this platform and a responsability of
            the admins.
          </Typography>
        </Grid>
        <Grid item xs={12} md={6} lg={6} sx={{ textAlign: "right" }}>
          <img
            src={"/static/graphics/podium.png"}
            alt={"podium"}
            loading="lazy"
          />
        </Grid>
      </Grid>
      <Divider variant="middle" sx={{ m: 3 }} />
      <Grid container spacing={2}>
        {/* Second position */}
        <Grid item xs={12} md={4} lg={4}>
          <Card>
            <CardMedia
              component="img"
              height="40"
              sx={{
                background: "#9CB8BE",
              }}
            />
            <CardContent sx={{ textAlign: "center" }}>
              {users && users.length > 1 ? (
                <UserAvatar id={users[1].id} sx={{ margin: "auto" }} />
              ) : (
                <></>
              )}

              <Typography
                gutterBottom
                variant="h5"
                component="div"
                sx={{ mt: 1 }}
              >
                {users && users.length > 1
                  ? users[1].name
                  : "No users here... "}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {users && users.length > 1
                  ? users[1].score + " points"
                  : "No users here... "}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        {/* First position */}
        <Grid item xs={12} md={4} lg={4}>
          <Card>
            <CardMedia
              component="img"
              height="40"
              sx={{
                background: "#FDD41F",
              }}
            />
            <CardContent sx={{ textAlign: "center" }}>
              {users && users.length > 0 ? (
                <UserAvatar id={users[0].id} sx={{ margin: "auto" }} />
              ) : (
                <></>
              )}

              <Typography
                gutterBottom
                variant="h5"
                component="div"
                sx={{ mt: 1 }}
              >
                {users && users.length > 0
                  ? users[0].name
                  : "No users here... "}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {users && users.length > 0
                  ? users[0].score + " points"
                  : "No users here... "}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        {/* Third position */}
        <Grid item xs={12} md={4} lg={4}>
          <Card>
            <CardMedia
              component="img"
              height="40"
              sx={{
                background: "#DB803D",
              }}
            />
            <CardContent sx={{ textAlign: "center" }}>
              {users && users.length > 2 ? (
                <UserAvatar id={users[2].id} sx={{ margin: "auto" }} />
              ) : (
                <></>
              )}

              <Typography
                gutterBottom
                variant="h5"
                component="div"
                sx={{ mt: 1 }}
              >
                {users && users.length > 2
                  ? users[2].name
                  : "No users here... "}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {users && users.length > 2
                  ? users[2].score + " points"
                  : "No users here... "}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      {users && users.length > 3 ? (
        <Container sx={{ width: "100%" }}>
          <DataGrid
            autoHeight
            rows={rows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            disableSelectionOnClick
          />
        </Container>
      ) : (
        <></>
      )}
    </>
  );
};

export default OverallLeaderboard;
