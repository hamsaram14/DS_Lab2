import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

function withRouter(Component) {
  return (props) => {
    const params = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    return <Component {...props} params={params} navigate={navigate} location={location} />;
  };
}

export default withRouter;
