import './App.css'
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom' 
import { Dashboard } from './pages/dashborad'
import { Auth } from './pages/auth'
import {  FinancialRecordsProvider } from './contexts/financial-record-context'
import { SignedIn, UserButton, useUser } from '@clerk/clerk-react'

function ProtectedDashboard(){
  const {user} = useUser();

  if(!user) {
    return <Navigate to="/auth"/>
  }
  
  return(
    <FinancialRecordsProvider>
      <Dashboard/>
    </FinancialRecordsProvider>
  )
}

function App() {

  return (
    <Router>
        <div className='app-container'>
          <div className="navbar">
            <Link to='/'> Dashboard </Link>
            <SignedIn>
              <UserButton/>
            </SignedIn>
          </div>
          <Routes>
            <Route path='/' element={<ProtectedDashboard/>} />
            <Route path='/auth' element={<Auth/>} />
          </Routes>
        </div>
    </Router>
  )
}

export default App
