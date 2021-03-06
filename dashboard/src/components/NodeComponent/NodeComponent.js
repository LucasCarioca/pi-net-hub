import axios from "axios";
import {Card, makeStyles, Typography} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import PowerSettingsNewIcon from "@material-ui/icons/PowerSettingsNew";
import GetAppIcon from "@material-ui/icons/GetApp";
import {config} from "../../config";

const useStyles = makeStyles({
    root: {
        backgroundColor: '#34495e',
        margin: '2rem',
        color: '#ecf0f1'
    },
    container: {
        padding: '2rem',
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
});

const NodeComponent = ({ node, children }) => {
    const classes = useStyles();
    const commandBaseUrl = node.name !== 'pinet' ? `${config.baseUrl}/nodes/${node.name}` : config.baseUrl;
    const rebootNode = () => {
        axios.get(`${commandBaseUrl}/reboot/`).catch(error => {
            console.error(error)
        })
    };
    const updateNode = () => {
        axios.get(`${commandBaseUrl}/update/`).catch(error => {
            console.error(error)
        })
    };
    return (<Card className={classes.root}>
        <div className={classes.container}>
            <Typography variant={'h2'}>{node.node}</Typography>
        </div>
        {children}
        <div className={classes.controls}>
            <Button className={classes.controlsButton} onClick={rebootNode}><PowerSettingsNewIcon/></Button>
            <Button className={classes.controlsButton} onClick={updateNode}><GetAppIcon/></Button>
        </div>
    </Card>)
};


export default NodeComponent;