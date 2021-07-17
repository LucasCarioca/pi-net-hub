import { useState, useEffect } from 'react';
import { Typography, Card, makeStyles, LinearProgress } from '@material-ui/core';
import OpacityIcon from '@material-ui/icons/Opacity';
import AcUnitIcon from '@material-ui/icons/AcUnit';
import WarningIcon from '@material-ui/icons/Warning';
import { NodeComponent } from "./index";
import { Alert } from "@material-ui/lab";
import axios from 'axios';
import { config } from '../../config';

const useStyles = makeStyles({
    root: {
        backgroundColor: '#34495e',
        margin: '2rem',
        color: '#ecf0f1'
    },
    container: {
        paddingBottom: '2rem',
        paddingLeft: '2rem',
        paddingRight: '2rem',
        height: '10rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-evenly'
    },
    measurement: {
        padding: 'auto auto',
        height: '3rem',
        display: 'flex',
        textAlign: 'center'
    },
    section: {
        marginLeft: '.5rem',
        marginRight: '.5rem',
        fontSize: '2rem'
    },
    sectionIcon: {
        marginLeft: '.5rem',
        marginRight: '.5rem',
        fontSize: '3rem'
    },
    warning: {
        padding: 'auto auto',
        height: '3rem',
        display: 'flex',
        textAlign: 'center',
        color: '#e74c3c'
    },
    time: {
        paddingLeft: '2rem',
        paddingRight: '2rem',
    }
});

const ClimateControlNodeComponent = ({ node }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [climateData, setClimateData] = useState();
    const [reload, setReload] = useState(new Date());
    useEffect(() => {
        setInterval(() => setReload(new Date()), 60 * 1000);
    }, []);
    useEffect(() => {
        setLoading(true)
        axios.get(`${config.baseUrl}/piz/${node.name}/`).then(response => {
                setClimateData(response.data);
            }).catch(error => {
                setError(error.message);
            }).finally(() => setLoading(false))
    }, [reload])
    const classes = useStyles();
    return (<NodeComponent node={node}>
        {loading ? <LinearProgress /> : null}
        {climateData ? (<>

            <div className={classes.container}>
                <div className={classes.measurement}>
                    <AcUnitIcon className={classes.sectionIcon} />
                    <Typography className={classes.section}>{climateData.temperature}</Typography>
                </div>
                <div className={climateData.humidity < 60 ? classes.measurement : classes.warning}>
                    <OpacityIcon className={classes.sectionIcon} />
                    <Typography className={classes.section}>{climateData.humidity}</Typography>
                    {climateData.humidity > 60 ? <WarningIcon className={classes.sectionIcon} /> : null}
                </div>
            </div>
            <p className={classes.time}>updated at: {climateData.UpdatedAt}</p>
        </>) : null}
        {error !== '' ? <Alert severity="error">{error}</Alert> : null}
    </NodeComponent>)
};


export default ClimateControlNodeComponent;