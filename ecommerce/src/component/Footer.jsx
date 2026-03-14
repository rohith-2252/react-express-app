
import './Footer.css';


// eslint-disable-next-line react/prop-types
export function Footer({user}) {
    return (
        <footer className="bottom-nav">
            <div className="nav-links">
                <button onClick={() => window.scrollTo(0, 0)}>Home</button>
                <button>Orders</button>
                <button>Cart</button>
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