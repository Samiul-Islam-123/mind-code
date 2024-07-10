import React, { useEffect, useState } from 'react'
import { useUserData } from '../../Context/UserDataContext'
import { Button, Card, CardActionArea, CardContent, Container, Grid, Toolbar, Typography } from '@mui/material';
import CreateProjectForm from '../CustomUIComponents/CreateProjectForm';

function Home() {
  const { userData, setUserData } = useUserData();

  const [NewProjectFormOpened, setNewProjectFormOpened] = useState(false);

  function toogleState() {
    setNewProjectFormOpened(!NewProjectFormOpened);
  }

  useEffect(() => {
    console.log(userData)
  }, [userData])

  return (
    <>

      <Container
        maxWidth="xl"
        sx={{
          flexGrow: 1
        }}
      >
        <Button onClick={toogleState}>
          Create new Project
        </Button>

        {NewProjectFormOpened === true && (<CreateProjectForm />)}

        {
          userData && (<>
            {
              (userData.user) ? (<>

                {userData.project.map(item => {
                  return (
                  <>
                    <Grid container>
                      <Grid item sx={4}>
                        <Card>
                          <CardActionArea>
                            <CardContent>
                              {item.Projectname}
                            </CardContent>
                          </CardActionArea>
                        </Card>
                      </Grid>
                    </Grid>
                  </>
                  )
                })
                  
                }


              </>) : (<>
                <Typography variant='h5'>
                  Loading...
                </Typography>
              </>)
            }
          </>)
        }

      </Container>
    </>
  )
}

export default Home