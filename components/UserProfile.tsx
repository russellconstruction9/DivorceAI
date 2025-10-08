import React from 'react';
import { UserProfile as UserProfileType } from '../types';

interface UserProfileProps {
    onSave: (profile: UserProfileType) => void;
    onCancel: () => void;
    currentProfile: UserProfileType | null;
}

const UserProfile: React.FC<UserProfileProps> = () => {
    return (
        <div className="space-y-6">
            <h1 className="text-4xl font-bold text-gray-900">User Profile</h1>
            <p className="text-gray-600">Manage your profile - To be implemented</p>
        </div>
    );
};

export default UserProfile;
