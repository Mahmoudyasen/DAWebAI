import Header from "./Header";
import Footer from "./Footer";




export default function RootLayout({ children }) {
  return (
        <div className="md:px-20">
          <Header/>
          {children}
          <Footer/>
        </div>
  );
}
