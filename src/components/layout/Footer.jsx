import { Instagram, Twitter, Youtube, Facebook } from 'lucide-react';
import { FaTiktok } from 'react-icons/fa';

const Footer = () => {
  const socialLinks = [
    { name: 'Instagram', icon: Instagram, href: 'https://instagram.com/xpatainment_', color: 'hover:text-pink-500' },
    { name: 'TikTok', icon: FaTiktok, href: 'https://tiktok.com/@xpatainment', color: 'hover:text-pink-500' },
    { name: 'Twitter', icon: Twitter, href: 'https://x.com/Xpatainment_', color: 'hover:text-blue-400' },
    { name: 'YouTube', icon: Youtube, href: 'https://www.youtube.com/channel/UClJBwdmqra_UoYkBC5Odnjg', color: 'hover:text-red-500' },
    { name: 'Facebook', icon: Facebook, href: 'https://facebook.com/xpataintment', color: 'hover:text-blue-600' }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="">
                <img src="/logo.png" alt="Logo" className="w-20" />
              </div>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              Discover and support amazing street talent from around the city.
              Every vote makes a difference in someone's dream.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    className={`text-gray-400 transition-colors duration-200 ${social.color}`}
                    aria-label={social.name}
                    target="_blank" rel="noopener noreferrer"
                  >
                    <IconComponent className="h-6 w-6" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/contestants" className="text-gray-400 hover:text-white transition-colors">Browse Contestants</a></li>
              <li><a href="/register" className="text-gray-400 hover:text-white transition-colors">Register Now</a></li>
              <li><a href="/donate" className="text-gray-400 hover:text-white transition-colors">Support Us</a></li>
              {/* <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Rules & FAQ</a></li> */}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a target='_blank' href="mailto:xpat@streetgottalent.com?subject=Street%20Got%20Talent%20Inquiry&body=Hello%20Xpatainment%2C%0A%0AI%20would%20like%20to%20know%20more%20about...">
                  xpat@streetgottalent.com
                </a>
              </li>

            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col  justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2025 StreetGotTalent. All rights reserved.
          </p>
          <p className="text-gray-400 text-xs mt-2">
            A project proudly crafted by <a href="https://bivoraltd.com" target="_blank" rel="noopener noreferrer" className="hover:underline">Bivora Ltd</a>.
          </p>

        </div>
      </div>
    </footer>
  );
};

export default Footer;