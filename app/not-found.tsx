'use client';
import { goDeveloper } from 'utils/url';

export default function NotFound() {
  if (typeof window !== 'undefined') {
    goDeveloper();
  }
  return <div />;
}
