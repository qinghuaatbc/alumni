import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import AlumniDetail from './pages/AlumniDetail';
import EditProfile from './pages/EditProfile';
import MyProfile from './pages/MyProfile';
import Library from './pages/Library';
import Messages from './pages/Messages';
import Album from './pages/Album';
import MapView from './pages/MapView';
import TV from './pages/TV';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-gray-50">
          <Routes>
            {/* Auth pages - no navbar */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected pages - with navbar */}
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <div className="flex flex-col min-h-screen">
                    <Navbar />
                    <main className="flex-1">
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/alumni/:id" element={<AlumniDetail />} />
                        <Route path="/profile" element={<MyProfile />} />
                        <Route path="/profile/edit" element={<EditProfile />} />
                        <Route path="/library" element={<Library />} />
                        <Route path="/messages" element={<Messages />} />
                        <Route path="/messages/:userId" element={<Messages />} />
                        <Route path="/album" element={<Album />} />
                        <Route path="/map" element={<MapView />} />
                        <Route path="/tv" element={<TV />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                      </Routes>
                    </main>
                    <footer className="bg-indigo-900 text-indigo-300 text-center text-sm py-4">
                      <p>Alumni Directory &copy; {new Date().getFullYear()} - Connect with your classmates</p>
                    </footer>
                  </div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
