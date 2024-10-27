import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { User, AdminStats } from '../types/auth';
import { Users, DollarSign, Clock, UserCheck } from 'lucide-react';
import { db } from '../utils/db';

const Admin = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    trialUsers: 0,
    lifetimeUsers: 0,
    revenueTotal: 0
  });

  useEffect(() => {
    if (!isAdmin) {
      navigate('/dashboard');
      return;
    }

    const loadData = async () => {
      try {
        // Load users
        const usersList = await db.getAllUsers();
        setUsers(usersList);

        // Load stats
        const stats = await db.getUserStats();
        setStats(stats);
      } catch (error) {
        console.error('Failed to load admin data:', error);
      }
    };

    loadData();
  }, [isAdmin, navigate]);

  return (
    <div className="min-h-screen bg-[#0B0F1A] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard
            icon={<Users className="h-5 w-5 text-blue-500" />}
            label="Total Users"
            value={stats.totalUsers}
          />
          <StatCard
            icon={<Clock className="h-5 w-5 text-orange-500" />}
            label="Trial Users"
            value={stats.trialUsers}
          />
          <StatCard
            icon={<UserCheck className="h-5 w-5 text-green-500" />}
            label="Lifetime Users"
            value={stats.lifetimeUsers}
          />
          <StatCard
            icon={<DollarSign className="h-5 w-5 text-yellow-500" />}
            label="Total Revenue"
            value={`$${stats.revenueTotal}`}
          />
        </div>

        {/* Users Table */}
        <div className="bg-[#151A2D] rounded-xl border border-[#1E2642] overflow-hidden">
          <div className="p-4 border-b border-[#1E2642]">
            <h2 className="text-lg font-semibold text-white">Users</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#1A1F35]">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Plan
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Last Login
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E2642]">
                {users.map((user) => (
                  <tr key={user.email}>
                    <td className="px-4 py-3 text-sm text-white">
                      {user.email}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${user.plan === 'lifetime' ? 'bg-green-500/10 text-green-500' : 'bg-orange-500/10 text-orange-500'}`}>
                        {user.plan.charAt(0).toUpperCase() + user.plan.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-400">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-400">
                      {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-gray-400">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: number | string }) => (
  <div className="bg-[#151A2D] rounded-xl border border-[#1E2642] p-4">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-400">{label}</p>
        <p className="text-2xl font-semibold text-white mt-1">{value}</p>
      </div>
      {icon}
    </div>
  </div>
);

export default Admin;