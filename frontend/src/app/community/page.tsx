'use client';

import { useEffect, useState } from 'react';
import { User } from '@/app/types/userTypes';
import UserCard from '../components/community/UserCard';
import UsersCard from '../components/community/UsersCard';
import Spinner from '../components/profile/Spinner';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

const CommunityPage = () => {
  const [talent, setTalent] = useState<User | null>(null);
  const [sameLevelTalents, setSameLevelTalents] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [hunters, setHunters] = useState<User[]>([]);
  const router = useRouter();

  const userId = '1';

  useEffect(() => {

    const fetchTalents = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/${userId}`
      );
      const userData = await res.json();
      setTalent(userData);

       const isTalent = userData.role === 'TALENT' || userData.role === 'BOTH';
       const isHunter = userData.role === 'HUNTER' || userData.role === 'BOTH';

       if (isTalent && userData.level_id) {
         const res2 = await fetch(
           `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/level/${userData.level_id}`
         );
         const talentsData = await res2.json();
         setSameLevelTalents(talentsData.filter((u: User) => u.id !== userId));
       } else if (isHunter) {
         const res3 = await fetch(
           `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/talents`
         );
         const allTalents = await res3.json();
         setSameLevelTalents(allTalents);
       }
    };

    const fetchHunters = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/hunters`
      );
      const huntersData = await res.json();
      console.log(huntersData);

      setHunters(huntersData.filter((u: User) => u.id !== userId)); 
    };
    fetchTalents();
    fetchHunters();
  }, [userId]);


  const filterTalents = sameLevelTalents.filter((u) =>
    `${u.first_name} ${u.last_name}`
      .trim()
      .toUpperCase()
      .includes(searchTerm.toUpperCase())
  );

  const filterHunters = hunters.filter((u) =>
    `${u.first_name} ${u.last_name}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

if (!talent ||  hunters.length === 0) {
  return <Spinner />;
}

  return (
    <div className="flex justify-center gap-20 mt-10 ">
      <div>
        {talent && (
          <UserCard user={talent} onClick={() => router.push(`/profile/`)} />
        )}
      </div>

      <div className="max-w-6xl p-7 bg-white rounded-2xl shadow-lg border border-gray-100">
        <section className="mb-8">
          <div className="flex items-center justify-between gap-5">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Community</h2>
              <p className="text-base font-normal text-gray-700 mb-4">
                Explore profiles across the LevelUp community
              </p>
            </div>

            <div className="relative max-w-lg text-stone-950">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search members by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-60 pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded-full 
                       focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
              />
            </div>
          </div>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Talents</h2>
          <UsersCard users={filterTalents} />
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Hunters</h2>
          <UsersCard users={filterHunters} />
        </section>
      </div>
    </div>
  );
};

export default CommunityPage;
