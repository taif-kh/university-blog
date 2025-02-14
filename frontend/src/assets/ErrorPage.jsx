import { Link } from "react-router-dom";

const ErrorPage = () => {

    return (
        <body>
            <div className="w-screen h-screen flex flex-col justify-center items-center text-3xl">
            <h1>Error!</h1>
            <br />
            <Link to="/"><u>Home</u></Link>
            </div>
        </body>
    );
};

export default ErrorPage;