import { useLibrary } from "../context/LibraryContext";
import LoadingScreen from "../components/LoadingScreen";
import NavBar from "../components/NavBar";
import Hero from "../components/Hero";
import BookList from "../components/BookList";
import CharacterSection from "../components/CharacterSection";
import Footer from "../components/Footer";
import RoomSection from "../components/RoomSection";
import ReadingHistory from "../components/ReadingHistory";
import FloatingCharacter from "../components/FloatingCharacter";

function HomePage() {
  const { authLoading } = useLibrary();

  /*
    Show loading screen while we verify
    if the user is already logged in.
    This prevents a flash of logged-out state.
  */
  if (authLoading) return <LoadingScreen />;

  return (
    <div className="app">
      <NavBar />
      <Hero />
      <ReadingHistory />
      <BookList />
      <RoomSection />
      <CharacterSection />
      <Footer />
      <FloatingCharacter />
    </div>
  );
}

export default HomePage;
