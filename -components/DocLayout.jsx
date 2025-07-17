import Footer from "./Footer";
import DocHeader from "./DocHeader";




export default function RootLayout({ children }) {
  return (
        <div className="md:px-20">
          <DocHeader/>
          {children}
        </div>
  );
}
