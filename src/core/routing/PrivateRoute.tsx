import { Navigate } from 'react-router-dom';
import { Routes } from './routes';

const PrivateRoute = ({ children, access }) => {
    if (access) {
        return children;
    } else {
        return <Navigate to={Routes.Base} />;
    }
};

export default PrivateRoute;
