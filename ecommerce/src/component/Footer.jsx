import {Link} from 'react-router'
import './Footer.css';


// eslint-disable-next-line react/prop-types
export function Footer({user}) {
    return (
        <footer className="bottom-nav">
            <div className="nav-links">
                <Link to="/"><button>Home</button></Link>
                <button>Orders</button>
                <Link to="/checkout"><button >Cart</button></Link>
            </div>

            <div className="profile-section">
                {/* Username on the left side of the photo */}
                <span className="username">{user.name}</span>
                <div className="profile-image-container">
                    <img
                        src={"/images/mobile-logo.png"}
                        alt="Profile"
                        className="profile-photo"
                    />
                </div>
            </div>
        </footer>
    );
}