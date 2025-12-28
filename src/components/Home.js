import { Link, useNavigate } from "react-router-dom";


export default function Home () {

    const navigate = useNavigate(); //for programatic navigation

    const handleServicesClick = () => {
        navigate("/serviceProducts"); //navigates to service products page
    }

    return (
        <main>
            <div className="navbar">
                <div className="navdiv">
                    <div className="top-row">
                        <div className="logo"><a href="#">JuikeExams</a></div>
                        <button onClick = {handleServicesClick}>Services</button>
                    </div>

                    <ul>
                        <li><a href="#">Home</a></li>
                        <li><a href="#">How To</a></li>
                    </ul>
                    </div>
            </div>

            <section className="hero">
                <div className="hero-background"></div>
                    <div className="hero-content">
                        <h1>Welcome to JuikeExams</h1>
                        <p>Your gateway to seamless exam token purchases.</p>
                        <Link to="/products" className="hero-btn">Get Started</Link>
                    </div>
            </section>
        </main>
    )
}