import React, {useEffect, useMemo, useState} from 'react';
import { Link } from 'react-router';

import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import axios from 'axios';

import { EyeIcon } from "@heroicons/react/24/outline";


function App() {
  const serverUrl = import.meta.env.VITE_API_URL;

  const [users, setUsers] = useState({}); 
  
  const [count, setCount] = useState(() => {
    const queryParameters = new URLSearchParams(window.location.search);
    const count = queryParameters.get("count");

    return count ? count : 6;
  });   
  const [page, setPage] = useState(() => {
    const queryParameters = new URLSearchParams(window.location.search);
    const page = queryParameters.get("page");

    return page ? page : 1;
  });
  const [apiUrl, setApiUrl] = useState(serverUrl+"/users?page="+page+"&count="+count);
  const [usersCountFrom, setUsersCountFrom] = useState(1);
  const [usersCountTo, setUsersCountTo] = useState(1);
  const [errors, setErrors] = useState(null);
  
  const [paginationTypeShowMore, setPaginationTypeShowMore] = useState(false);
  
  
  
  const updateUsersList = async(pageUrl) => {      
    
    await axios.get(pageUrl)
      .then((response) => {
        let elementIndex = page > 1 
          ? !paginationTypeShowMore 
            ? (page-1) * count 
            : usersCountFrom -1
          : 0;

        let prevUsers = Object.keys(users).length !== 0 && paginationTypeShowMore ? users.users : [];
        let newUsersList = response.data;
        newUsersList.users = [...prevUsers, ...newUsersList.users];
        
        console.info("element index: ", elementIndex, 'usersCountFrom', usersCountFrom);
        newUsersList.users.map((user)=>(
          user.listIndex = elementIndex +=1
        ))

        console.log(newUsersList); 
        setUsers(response.data);        
        
      }).catch(error => {       
        setErrors(error.response.data);
      });    
  };

  
  const updateHttp = () => {
    window.history.replaceState(null, 'page title', `?page=${page}&count=${count}`);
  }

  const handleUpdateUsersList = (pageUrl) => {    
    setPaginationTypeShowMore(false);
    setApiUrl(pageUrl);    
  }

  const showMore = () => {
    setPaginationTypeShowMore(true);
    setPage(page+1);     
  }  
 
  useEffect(() => { 
    if(page){      
      setApiUrl(serverUrl+"/users?page="+page+"&count="+count); 
    } 
        
  }, [count, page]);

  
  useEffect(()=>{     
    updateHttp();
    
    updateUsersList(apiUrl); 

  }, [apiUrl]);
  
  useEffect(() => {   
    if(!paginationTypeShowMore)     
      window.scroll(0,0);
    
    setPage(users.page);
 
    setUsersCountFrom((countFrom) => {
      if(users.page === 1){
        return 1;
      }
      if(paginationTypeShowMore){
        return countFrom;
      }
      return (users.page * users.count - users.count)+1;
    });  
    
    setUsersCountTo((usersTo) => { 
        let countUsers = users.page * users.count;
        if(countUsers>users.total_users){
          return users.total_users;
        }     
        return countUsers;
    })  
  
  }, [users]);
 
  return (
    <>
      {errors && ( 
        <div>
          <h2>{errors.message}</h2>
          <ul className="list-disc ml-6">
            {errors.fails &&(
              Object.keys(errors.fails).map((key) => {
                return <li key={key} className='text-red-600'>{key}: {errors.fails[key][0]}</li>
              })
            )}                    
          </ul> 
          <p>We have a problem</p>
        </div>        
               
      )}    
        
      <div className={errors ? "hidden smt-3 pt-3" : "mt-3 pt-3"} >

        <div className="flex justify-between">
          <div>
            <Link 
              to={{pathname: '/create'}}
              className='text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-green-600 dark:hover:bg-green-700 focus:outline-none dark:focus:ring-green-800'
            >
              Add new user          
            </Link>
          </div>
          <div className="w-50">
            {/* <div className="grid gap-6 mb-6 md:grid-cols-2">
              <div className="mr-2">
                  <label 
                    htmlFor="page" 
                    className="block text-sm font-medium text-gray-900 dark:text-white">
                      Page                    
                  </label>
                  <input
                    value={page ?? ''}
                    onChange={e => handleSetPage(e.target.value)}                     
                    min="1"
                    max={users.total_pages}
                    type="number"                     
                    id="page" 
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                    />
                </div>             

              <div>
                  <label 
                    htmlFor="count" 
                    className="block text-sm font-medium text-gray-900 dark:text-white">
                      Count                    
                  </label>
                  <input 
                    value={count ?? ''}
                    onChange={e => handleSetCount(e.target.value)}                    
                    type="number"                    
                    id="count" 
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                    />
              </div>
            </div>  */} 
          </div>
        </div>
        
        
        <table className="table mt-3">
          {/* head */}
          <thead>
            <tr>
              <th></th>
              <th>Image</th>            
              <th>Name</th>
              <th>Job</th>
              <th>Email</th>
              <th>Start date</th> 
              <th></th>             
            </tr>
          </thead>
          <tbody>
            {users && users.users && (              
              users.users.map((user, index) => (
                <tr key={user.id}>
                  <td>
                    {user.listIndex}
                  </td>
                  <td>
                    <img src={user.photo} alt="" />
                  </td>
                  <td>
                    {user.name}
                  </td>
                  <td>
                    {user.position ? user.position : 'unemployed'}
                  </td>
                  <td>
                    {user.email}
                  </td>
                  <td>
                    {new Date(user.registration_timestamp * 1000).toLocaleString(
                      "uk-UA",
                      {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric"
                      }
                    ) }
                  </td>
                  <td>
                    <Link 
                      to={`user/${user.id}`}
                      className="btn btn-square">
                      <EyeIcon className="h-6 w-6 text-gray-500" />
                    </Link>
                  </td>
                </tr>
              )                
              )              
            )}                             
          </tbody>       
          <tfoot>
            <tr> 
              <th></th> 
              <th>Image</th>            
              <th>Name</th>
              <th>Job</th>
              <th>Email</th>
              <th>Start date</th> 
              <th></th>                   
            </tr>
          </tfoot>
        </table> 

        {users && (
          <div className="flex flex-col items-center"> 
            <button 
              onClick={showMore}
              disabled={users.links && !users.links.next_url ? "disabled" : ''} 
              className="btn btn-outline btn-info mt-3 mb-3"
            >
                Show more
            </button>         
            <span className="text-sm text-gray-700 dark:text-gray-400">
                Showing 
                <span className="font-semibold text-gray-900 dark:text-white"> {usersCountFrom} </span>
                to 
                <span className="font-semibold text-gray-900 dark:text-white"> {usersCountTo} </span> 
                of 
                <span className="font-semibold text-gray-900 dark:text-white"> {users.total_users} </span> 
                Entries
            </span>

            <div className="inline-flex mt-2 xs:mt-0"> 
              <button 
                onClick={() => handleUpdateUsersList(users.links.prev_url)}
                disabled={users.links && !users.links.prev_url ? "disabled" : ''}    
                className="flex items-center justify-center px-3 h-8 text-sm font-medium text-white bg-gray-800 rounded-s hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                  <svg className="w-3.5 h-3.5 me-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5H1m0 0 4 4M1 5l4-4"/>
                  </svg>
                  Prev
              </button>         
              
              
              <button 
                onClick={() => handleUpdateUsersList(users.links.next_url)}
                disabled={users.links && !users.links.next_url ? "disabled" : ''} 
                className="flex items-center justify-center px-3 h-8 text-sm font-medium text-white bg-gray-800 border-0 border-s border-gray-700 rounded-e hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                  Next
                  <svg className="w-3.5 h-3.5 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                </svg>
              </button>
            </div>
          </div>
        )}      
      </div>   
      
    </>
  )
}

export default App
