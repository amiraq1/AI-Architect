import { Button } from '@/components/ui/Button';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';

export function SocialButtons() {
    return (
        <div className="grid grid-cols-2 gap-4 mb-6">
            <Button variant="secondary" className="w-full text-sm font-normal text-slate-300">
                <FcGoogle className="w-5 h-5 ml-2" />
                Google
            </Button>
            <Button variant="secondary" className="w-full text-sm font-normal text-slate-300">
                <FaGithub className="w-5 h-5 ml-2 text-white" />
                GitHub
            </Button>
        </div>
    );
}

export function Divider() {
    return (
        <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-800"></div>
            </div>
            <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-slate-900 text-slate-500">أو</span>
            </div>
        </div>
    );
}
