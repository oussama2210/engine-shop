import { FaFacebook, FaTwitter, FaInstagram, FaLinkedinIn, FaYoutube } from 'react-icons/fa';
import Link from 'next/link';

export default function SocialMedia({ className, iconClassName, tooltipClassName }) {
  const networks = [
    { name: 'Facebook', icon: FaFacebook, href: '#' },
    { name: 'Twitter', icon: FaTwitter, href: '#' },
    { name: 'Instagram', icon: FaInstagram, href: '#' },
    { name: 'Linkedin', icon: FaLinkedinIn, href: '#' },
    { name: 'Youtube', icon: FaYoutube, href: '#' },
  ];

  return (
    <div className={`flex items-center gap-4 ${className || ''}`}>
      {networks.map(({ name, icon: Icon, href }) => (
        <Link 
          key={name}
          href={href} 
          className={`flex h-9 w-9 items-center justify-center rounded-full border transition-colors ${iconClassName || 'border-gray-200 text-gray-500 hover:border-[#2a5b46] hover:text-[#2a5b46]'}`}
          aria-label={name}
          title={name}
        >
          <Icon className="h-4 w-4" />
        </Link>
      ))}
    </div>
  );
}
