import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import Select from 'react-select';
import axios from 'axios';

function CreateUser(){
    const refImageInput = React.useRef();

    const [token, setToken] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [positions, setPositions] = useState([]);
    const [position, setPosition] = useState(0);
    const [photo, setPhoto] = useState({});
    const [errors, setErrors] = useState(null);
    const [response, setResponse] = useState(null);
    const [showRefreshTokenButton, setShowRefreshTokenButton] = useState(false);

    const getPositions = (apiPositionsUrl) => {
        axios.get(apiPositionsUrl)
            .then((response) => {                
                setPositions(response.data.positions);
            }).catch((error) => {                
                setErrors(error.response);
                window.scrollTo(0, 0)
            })
    }

    const getToken = (apiTokenUrl) => {
        axios.get(apiTokenUrl)
        .then((response) => {            
            setToken(response.data.token);
            setShowRefreshTokenButton(false);
            setErrors(null);
        }).catch((error) => {            
            setErrors(error.response);
            window.scrollTo(0, 0);
        })
    }

    const handleRefreshToken = () => {
        getToken('http://localhost:8080/api/token')
    }

    const createUser = (event) => {
        const config = {
            headers: {
                Token: token,  
                "content-type": "multipart/form-data",             
             }
        };
        const formData = new FormData();
        formData.append('token', token);
        formData.append('name', name);
        formData.append('email', email);
        formData.append('phone', phone,);
        formData.append('position_id', position.id,);
        formData.append('photo', photo);        

        axios.post("http://localhost:8080/api/users", formData, config)
            .then((response)=>{                
                setResponse(response.data);                
                setName('');
                setEmail('');
                setPhone('');
                setPosition(0);
                setPhoto({});
                setErrors(null);
                refImageInput.current.value = "";
                
            }).catch((error) => {                
                if(error && error.response.status === 401)
                    setShowRefreshTokenButton(true);

                setResponse(null);
                setErrors(error.response.data);
                window.scrollTo(0, 0);
            })
    }
    

    useEffect(() => {
        getPositions("http://localhost:8080/api/positions");
        getToken("http://localhost:8080/api/get-token")
    }, []);    

    return (
        <div className="grid content-center  m-2 pt-3">
            <Link 
                className='w-50 mb-3 text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-green-600 dark:hover:bg-green-700 focus:outline-none dark:focus:ring-green-800'
                to={{pathname: '/'}}
            >
                Back to users list
            </Link>  

            {errors && (
                <div>
                    <h2 className='text-red-600'>{errors.message}</h2>
                    <ul className="list-disc ml-6">
                            {errors.errors &&(                                
                                Object.keys(errors.errors).map((key) => {                                    
                                    return <li key={key} className='text-red-600'>{key}: {errors.errors[key][0]}</li>
                                })
                        )}                    
                    </ul>                     
                </div>
                
            )}

            {response && (
                <div role="alert" className="alert alert-success">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{response.message}</span>
                </div>
            )}          

            <div className="grid gap-6 mb-6 md:grid-cols-4">                
                {showRefreshTokenButton &&(
                    <div className='col-span-1 pt-7'>
                    <button 
                        onClick={handleRefreshToken}
                        type="button" 
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                        >
                        Refresh Token
                    </button>
                    </div>
                )}
                
            </div>
            
            <div className="grid gap-6 mb-6 md:grid-cols-2">
                <div>
                    <label 
                    htmlFor="name" 
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        Name
                    </label>
                    <input
                        value={name}
                        onChange={event => setName(event.target.value)} 
                        type="text" 
                       id="name" 
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                        placeholder="User name"                             
                    />
                </div>
                <div>
                    <label 
                        htmlFor="email" 
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        Email address
                    </label>
                    <input
                        value={email}
                        onChange={event => setEmail(event.target.value)} 
                        type="email" 
                        id="email" 
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                        placeholder="Email address"                             
                    />
                </div>                    
            </div>

            <div className="grid gap-6 mb-6 md:grid-cols-2">
                <div>
                    <label 
                    htmlFor="phone" 
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        Phone
                    </label>
                    <input
                        value={phone}
                        onChange={event => setPhone(event.target.value)} 
                        type="text" 
                        id="phone" 
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                        placeholder="Phone number"                             
                    />
                </div>
                <div>
                    <label 
                        htmlFor="positionId" 
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        Position
                    </label>

                    <Select 
                        key={positions.id}                        
                        getOptionValue={option => `${option.id}`}
                        getOptionLabel={option => `${option.name}`}
                        onChange={(position) => setPosition(position)}
                        placeholder={"Positions list"}                        
                        options={positions}
                        value={position}                        
                    />

                   
                </div>                    
            </div>

            <div className="grid gap-6 mb-6 md:grid-cols-2">
                <div>
                    <input 
                        onChange={event => setPhoto(event.target.files[0])}
                        ref={refImageInput}
                        type="file" 
                        className="file-input" 
                        />
                </div>
            </div>
                
            <div className="grid gap-6 mb-6 md:grid-cols-4">
                <button 
                    onClick={createUser}
                    type="submit" 
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                    Create
                </button>
            </div>    
                

        </div>
    );
}

export default CreateUser;