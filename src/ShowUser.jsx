import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Link } from 'react-router';
import axios from 'axios';

function ShowUser(props){
    const {id} = useParams();
    const [user, setUser] = useState({});

    const getUser = async(pageUrl) => {      
    
        await axios.get(pageUrl)
          .then((response) => {
            setUser(response.data.user);
            console.info(response.data);
          }).catch(error => {
            console.error(error.response.data);
            setErrors(error.response.data);
          });    
      };

    useEffect(() => {
        const u = getUser(`http://localhost:8080/api/users/${id}`);
        setUser(u);
    }, []);

    useEffect(() => {
        document.title = user.name;
    }, [user])

    console.info(user);

    return (
        <div className="card bg-base-100 w-96 shadow-sm">
            <Link 
                className='w-50 mb-3 text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-green-600 dark:hover:bg-green-700 focus:outline-none dark:focus:ring-green-800'
                to={{pathname: '/'}}
            >
                Back to users list
            </Link>  
            <figure>
                <img
                src={user.photo}
                alt={user.name} />
            </figure>
            <div className="card-body">
                <h2 className="card-title">{user.name}</h2>
                <p>Email: {user.email}</p>
                <p>Phone: {user.phone}</p>
                <p>Position: {user.position}</p>
                <p>
                    {'Date: ' + new Date(user.registration_timestamp * 1000).toLocaleString(
                        "uk-UA",
                        {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric"
                        }
                    )}
                </p>               
            </div>
        </div>
    );
}

export default ShowUser