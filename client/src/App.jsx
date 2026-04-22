import React from 'react'
import { Link, Route, Routes, useNavigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Project from './pages/Project'
import { RedirectToSignIn, RedirectToUserProfile, SignedIn, SignedOut, UserButton, UserProfile, } from '@clerk/clerk-react'
import Navbar from './components/Topbar'
import Layout from './components/Layout'
import Projects from './pages/Projects'
import Team from './pages/Team'

function SettingsModal() {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="rounded-xl m-8 relative p-6">

        <button
          onClick={() => navigate(-1)}
          className="absolute top-8 right-8 z-50 hover:bg-gray-300 rounded-full w-8 h-8 flex items-center justify-center"
        >
          ✕
        </button>

        <UserProfile />
      </div>
    </div>
  );
}

const App = () => {
  return (
    <div className='min-h-screen bg-sky-50'>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/dashboard' element={
          <>
            <SignedIn>
              <Layout>
                <Dashboard />
              </Layout>
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        } />
        <Route path='/projects' element={
          <>
            <SignedIn>
              <Layout>
                <Projects />
              </Layout>
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        } />
        <Route path='/project/:id' element={
          <>
            <SignedIn>
              <Layout>
                <Project />
              </Layout>
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        } />
        <Route path='/team' element={
          <>
            <SignedIn>
              <Layout>
                <Team />
              </Layout>
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        }
        />
        <Route
          path="/settings"
          element={
            <>
              <SignedIn>
                <Layout>
                  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl m-8">
                      <SettingsModal/>
                    </div>
                  </div>
                </Layout>
              </SignedIn>

              <SignedOut>
                <RedirectToSignIn />
              </SignedOut>
            </>
          }
        />
      </Routes>
    </div>
  )
}

export default App
