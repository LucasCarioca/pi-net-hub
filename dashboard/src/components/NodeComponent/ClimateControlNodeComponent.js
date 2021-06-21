import {Typography, Card, makeStyles} from '@material-ui/core';
import OpacityIcon from '@material-ui/icons/Opacity';
import AcUnitIcon from '@material-ui/icons/AcUnit';
import WarningIcon from '@material-ui/icons/Warning';
import {NodeComponent} from "./index";

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
    },
    measurement: {
        padding: 'auto auto',
        height: '3rem',
        display: 'flex',
        textAlign: 'center'
    },
    controls: {
        borderTop: 'solid 1px #2c3e50',
        height: '3rem',
        display: 'flex',
        textAlign: 'center',
        justifyContent: 'space-evenly',
        color: '#ecf0f1'
    },
    controlsButton: {
        width: '100%',
        height: '100%',
        color: '#ecf0f1'
    },
    section: {
        margin: '1rem'
    },
    warning: {
        padding: 'auto auto',
        height: '3rem',
        display: 'flex',
        textAlign: 'center',
        color: '#e74c3c'
    }
});

const ClimateControlNodeComponent = ({node}) => {
    const classes = useStyles();
    return (<NodeComponent node={node}>
        <div className={classes.container}>
            <div className={classes.measurement}>
                <AcUnitIcon className={classes.section}/>
                <Typography className={classes.section}>{node.temp}*C</Typography>
            </div>
            <div className={node.humidity < 60 ? classes.measurement : classes.warning}>
                <OpacityIcon className={classes.section}/>
                <Typography className={classes.section}>{node.humidity}% </Typography>
                {node.humidity > 60 ? <WarningIcon className={classes.section}/> : null}
            </div>
        </div>
    </NodeComponent>)
};


export default ClimateControlNodeComponent;