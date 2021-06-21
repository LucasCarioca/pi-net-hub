import React from 'react';
import {useEffect, useState} from 'react';
import {LinearProgress, Grid, Typography, Container, makeStyles} from "@material-ui/core";
import {Alert} from "@material-ui/lab";
import {ClimateControlNodeComponent, NodeComponent} from "../NodeComponent";
import LoopIcon from '@material-ui/icons/Loop';
import GetAppIcon from '@material-ui/icons/GetApp';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import axios from 'axios';
import Button from "@material-ui/core/Button";
import {config} from "../../config";

const useStyles = makeStyles({
    root: {
        marginTop: '3rem',
        color: '#ecf0f1'
    },
    globalButton: {
        margin: '.5rem'
    },
    section: {
        marginTop: '3rem',
    }
});


function Home() {
    const classes = useStyles();
    const [nodes, setNodes] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [reload, setReload] = useState(new Date());
    const rebootAll = () => {
        axios.get(`${config.baseUrl}/reboot-nodes`).catch(error => {
            console.error(error)
        })
    };
    const updateAll = () => {
        axios.get(`${config.baseUrl}/update-nodes`).catch(error => {
            console.error(error)
        })
    };
    useEffect(() => {
        setInterval(() => setReload(new Date()), 5 * 1000);
    }, []);
    useEffect(() => {
        axios.get(`${config.baseUrl}/climate`).then(response => {
            setNodes(response.data);
        }).catch(error => {
            setError("Something went wrong");
        }).finally(() => {
            setLoading(false);
        })
    }, [reload])
    const triggerReload = (showLoading) => {
        if (showLoading) setLoading(true);
        setReload(new Date());
    };
    if (error !== "") return <Alert severity={'error'}>{error}</Alert>
    if (loading) return <LinearProgress/>
    return (
        <Container className={classes.root}>
            <Typography variant={'h1'}>PiNet</Typography>
            <div className={classes.section}>
                <Button variant={'contained'} size={'large'} className={classes.globalButton}
                        onClick={triggerReload}><LoopIcon/> &nbsp; Force reload </Button>
                <Button variant={'contained'} size={'large'} className={classes.globalButton}
                        onClick={rebootAll}><PowerSettingsNewIcon/> &nbsp; Reboot all nodes </Button>
                <Button variant={'contained'} size={'large'} className={classes.globalButton}
                        onClick={updateAll}><GetAppIcon/> &nbsp; Update all nodes </Button>
            </div>
            <div className={classes.section}>
                <Typography variant={'h2'}>Climate control nodes</Typography>
                <Grid container>
                    {nodes.map(node => <Grid item lg={4} md={6} xs={12}><ClimateControlNodeComponent
                        reload={triggerReload} node={node}/></Grid>)}
                </Grid>
            </div>
            <div className={classes.section}>
                <Typography variant={'h2'}>Hub nodes</Typography>
                <NodeComponent node={{node: "PiNet Hub", location: "office"}}/>
            </div>
        </Container>
    );
}

export default Home;
