import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Instagram, Music, ExternalLink, Link2 } from 'lucide-react';
import { FaTiktok } from 'react-icons/fa';

const ContestantCard = ({ contestant }) => {

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
      {/* Image */}
      <div className="relative aspect-[16/9] overflow-hidden">
        <img
          src={contestant.imageUrl}
          alt={contestant.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />

        {/* Performance Type Badge */}
        <div className="absolute top-4 left-4">
          <span className="inline-flex items-center px-3 py-1 bg-primary-500 text-white text-xs font-medium rounded-full">
            <Music className="h-3 w-3 mr-1" />
            {contestant.performanceType}
          </span>
        </div>

        {contestant.group && (
          <div className="absolute top-4 left-30">
            <span className="inline-flex items-center px-3 py-1 bg-primary-500 text-white text-xs font-medium rounded-full">
              <Music className="h-3 w-3 mr-1" />
              {contestant.group || 'none'}
            </span>
          </div>
        )}

        {/* Vote Count */}
        <div className="absolute top-4 right-4">
          <div className="bg-white bg-opacity-90 rounded-full px-3 py-1 flex items-center">
            <Heart className="h-4 w-4 text-red-500 mr-1" />
            <span className="text-sm font-semibold text-gray-900">{contestant.votes}</span>
          </div>
        </div>

        {/* Name Overlay */}
        <div className="absolute bottom-4 left-4">
          <h3 className="text-xl font-bold text-white">{contestant.name}</h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <p className="text-gray-600 mb-4 line-clamp-2">{contestant.description || "no description"}</p>

        {/* Social Links */}
        <div className="flex items-center space-x-4 mb-4">
          {contestant.socials.instagram && (
            <a
              href={contestant.socials.instagram.replace('@', '')}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-pink-600 hover:text-pink-700 text-sm"
            >
              <Instagram className="h-4 w-4 mr-1" />
              {contestant.socials.instagram.split('/').pop()}
            </a>
          )}

          {contestant.socials.tiktok && (
            <a
              href={contestant.socials.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-pink-600 hover:text-pink-700 text-sm"
            >
              <FaTiktok className="h-4 w-4 mr-1" />
              {
                // convert Tiktok string to array and get last element
                contestant.socials.tiktok.split('/').pop()
              }
            </a>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <Link
            to={`/contestants/${contestant._id}`}
            className="inline-flex items-center justify-center bg-primary-600 hover:bg-primary-700 text-white font-semibold text-base px-5 py-2 rounded-full shadow-lg transition-all duration-200 group"
          >
            Vote for Me
            <ExternalLink className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ContestantCard;