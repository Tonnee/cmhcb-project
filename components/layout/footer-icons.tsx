import * as React from "react";
import { HiEnvelope, HiPhone, HiMapPin } from "react-icons/hi2";
import { FaFacebookF, FaInstagram, FaXTwitter, FaLinkedinIn, FaYoutube } from "react-icons/fa6";

interface IconProps {
  className?: string;
}

export function EmailIcon({ className = "" }: IconProps): React.JSX.Element {
  return <HiEnvelope className={`shrink-0 ${className}`} aria-hidden="true" />;
}

export function PhoneIcon({ className = "" }: IconProps): React.JSX.Element {
  return <HiPhone className={`shrink-0 ${className}`} aria-hidden="true" />;
}

export function LocationPinIcon({ className = "" }: IconProps): React.JSX.Element {
  return <HiMapPin className={`shrink-0 ${className}`} aria-hidden="true" />;
}

export function FacebookIcon({ className = "" }: IconProps): React.JSX.Element {
  return <FaFacebookF className={className} aria-hidden="true" />;
}

export function InstagramIcon({ className = "" }: IconProps): React.JSX.Element {
  return <FaInstagram className={className} aria-hidden="true" />;
}

export function TwitterXIcon({ className = "" }: IconProps): React.JSX.Element {
  return <FaXTwitter className={className} aria-hidden="true" />;
}

export function LinkedInIcon({ className = "" }: IconProps): React.JSX.Element {
  return <FaLinkedinIn className={className} aria-hidden="true" />;
}

export function YouTubeIcon({ className = "" }: IconProps): React.JSX.Element {
  return <FaYoutube className={className} aria-hidden="true" />;
}
