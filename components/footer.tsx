import { Github } from "lucide-react";
import Link from "next/link";
import { XLogoIcon } from "./ui/icons";
export function Footer() {
  return (
    <footer className="bg-black text-white rounded-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Running SQL
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Theme Generation
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Plugin Recommendations
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Code Search
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  API Reference
                </a>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="hover:text-white transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Community Forum
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a
                  href="mailto:support@Wordpress Copilot"
                  className="hover:text-white transition-colors"
                >
                  Contact
                </a>
              </li>
              <li>
                <a
                  href="/privacy-policy"
                  className="hover:text-white transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Stay Updated</h3>
            <p className="mb-4">
              Subscribe to our newsletter for the latest updates and features.
            </p>
            <form className="space-y-2">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-gray-800 border-gray-700 text-white"
              />
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </div> */}

        <div className="pt-4 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center">
          <div className="flex space-x-6 mb-4 sm:mb-0">
            <Link
              href="https://x.com/wpcopilot_dev"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <div className="h-6 w-6">
                <XLogoIcon />
                <span className="sr-only">X</span>
              </div>
            </Link>
            <Link
              href="https://github.com/wordpresscopilot"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Github className="h-6 w-6" />
              <span className="sr-only">GitHub</span>
            </Link>
          </div>
          <div className="text-sm text-white">
            © {new Date().getFullYear()} wpc.dev All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
