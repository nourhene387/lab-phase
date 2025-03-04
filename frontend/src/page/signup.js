import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/signup.css';
import { useDispatch, useSelector } from 'react-redux';
import { setUserInfo, setError, setLoading, handleSubmit, setAuth } from '../redux/actions/userActions';

const SignUp = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { 
        username, 
        email, 
        confirmEmail, 
        password, 
        confirmPassword, 
        phone, 
        sexe, 
        dateofbirth, 
        error, 
        loading, 
        isauth // Access isauth state
    } = useSelector((state) => state.user);

    // Redirect to /upload if authenticated
    useEffect(() => {
        if (isauth) {
            navigate('/upload'); // Redirect to /upload if user is authenticated
        }
    }, [isauth, navigate]); // Trigger re-run when isauth state changes

    useEffect(() => {
        dispatch(setUserInfo({})); // Reset user information on component mount
    }, [dispatch]);

    const onChangeHandler = (e) => {
        dispatch(setUserInfo({ [e.target.id]: e.target.value }));
    };

    const userData = { username, email, confirmEmail, password, confirmPassword, phone, sexe, dateofbirth };
    const onSubmitHandler = (e) => {
        e.preventDefault();
        dispatch(handleSubmit(userData)); // Dispatch handleSubmit action
    };

    return (
        <div className="sign-up-container">
            <h2>Create an Account</h2>
            <p>It's quick and easy.</p>

            <form className="sign-up-box" onSubmit={onSubmitHandler}>
                <div className="signup_input-group">
                    <label htmlFor="username" className="sign-label">Username</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={onChangeHandler}
                        required
                    />
                </div>

                <div className="signup_input-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={onChangeHandler}
                        required
                    />
                </div>

                <div className="signup_input-group">
                    <label htmlFor="confirmEmail">Confirm Email</label>
                    <input
                        type="email"
                        id="confirmEmail"
                        value={confirmEmail}
                        onChange={onChangeHandler}
                        required
                    />
                </div>

                <div className="signup_input-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={onChangeHandler}
                        required
                    />
                </div>

                <div className="signup_input-group">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={onChangeHandler}
                        required
                    />
                </div>

                <div className="signup_input-group">
                    <label htmlFor="phone">Phone Number</label>
                    <input
                        type="text"
                        id="phone"
                        value={phone}
                        onChange={onChangeHandler}
                        required
                    />
                </div>

                <div className="signup_input-group">
                    <label>Gender</label>
                    <div className="gender-input">
                        <div>
                            <input
                                type="radio"
                                id="female"
                                name="gender"
                                value="Female"
                                onChange={() => dispatch(setUserInfo({ sexe: 'Female' }))} // Set gender as Female
                            />
                            <label htmlFor="female">Female</label>
                        </div>
                        <div>
                            <input
                                type="radio"
                                id="male"
                                name="gender"
                                value="Male"
                                onChange={() => dispatch(setUserInfo({ sexe: 'Male' }))} // Set gender as Male
                            />
                            <label htmlFor="male">Male</label>
                        </div>
                    </div>
                </div>

                <div className="signup_input-group">
                    <label htmlFor="dateofbirth">Date of Birth</label>
                    <input
                        type="date"
                        id="dateofbirth"
                        value={dateofbirth}
                        onChange={onChangeHandler}
                        required
                    />
                </div>

                {error && <div className="error">{error}</div>}

                <button type="submit" className="sign-up-btn" disabled={loading}>
                    {loading ? 'Signing up...' : 'Sign Up'}
                </button>
            </form>

            <div className="login-section">
                Already have an account? <Link to="/login">Log In</Link>
            </div>
        </div>
    );
};

export default SignUp;
