import React, { useEffect, useState } from 'react';
import { useUserData } from '../../Context/UserDataContext';
import { Button, Card, CardActionArea, CardContent, Container, Grid, Typography } from '@mui/material';
import CreateProjectForm from '../CustomUIComponents/CreateProjectForm';
import { useNavigate } from 'react-router-dom';

function Home() {
  const { userData , makeAPICall} = useUserData();
  const [NewProjectFormOpened, setNewProjectFormOpened] = useState(false);
  const navigate = useNavigate();

  function toggleState() {
    setNewProjectFormOpened(!NewProjectFormOpened);
  }

  useEffect(() => {
    makeAPICall()
  }, []);

  return (
    <Container
      maxWidth="xl"
      sx={{
        flexGrow: 1,
        mt: 2
      }}
    >
      <Button variant="contained" color="primary" onClick={toggleState} sx={{ mb: 2 }}>
        Create new Project
      </Button>

      {NewProjectFormOpened && <CreateProjectForm />}

      {userData ? (
        userData.user ? (
          <Grid container spacing={2}>
            {userData.project.map((item, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <Card>
                  <CardActionArea onClick={() => {
                    navigate('project/'+item._id);
                  }}>
                    <CardContent>
                      <Typography variant="h6" component="div">
                        {item.Projectname}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography variant="h5">
            Loading...
          </Typography>
        )
      ) : (
        <Typography variant="h5">
          No user data available
        </Typography>
      )}
    </Container>
  );
}

export default Home;
