
import React, { useState } from 'react';
import { Package, Plus, X, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PackageManagerProps {
  packages: string[];
  onPackagesChange: (packages: string[]) => void;
  isVisible: boolean;
}

const PackageManager: React.FC<PackageManagerProps> = ({
  packages,
  onPackagesChange,
  isVisible
}) => {
  const [newPackage, setNewPackage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const popularPackages = [
    'axios',
    'lodash',
    'moment',
    'react-router-dom',
    'styled-components',
    'uuid',
    'classnames',
    'prop-types'
  ];

  const addPackage = (packageName: string) => {
    if (packageName && !packages.includes(packageName)) {
      onPackagesChange([...packages, packageName]);
      setNewPackage('');
    }
  };

  const removePackage = (packageName: string) => {
    // Don't allow removing core React packages
    if (packageName === 'react' || packageName === 'react-dom') {
      return;
    }
    onPackagesChange(packages.filter(pkg => pkg !== packageName));
  };

  const filteredPopularPackages = popularPackages.filter(pkg =>
    !packages.includes(pkg) &&
    pkg.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto bg-gray-800 border-gray-700">
        <CardHeader className="border-b border-gray-700">
          <CardTitle className="flex items-center space-x-2 text-white">
            <Package className="w-5 h-5" />
            <span>Package Manager</span>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-6 space-y-6">
          {/* Current Packages */}
          <div>
            <h3 className="text-sm font-medium text-gray-300 mb-3">Installed Packages</h3>
            <div className="flex flex-wrap gap-2">
              {packages.map((pkg) => (
                <Badge
                  key={pkg}
                  variant="secondary"
                  className="bg-blue-600 text-white pr-1"
                >
                  {pkg}
                  {pkg !== 'react' && pkg !== 'react-dom' && (
                    <button
                      onClick={() => removePackage(pkg)}
                      className="ml-2 hover:bg-blue-700 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </Badge>
              ))}
            </div>
          </div>

          {/* Add Package */}
          <div>
            <h3 className="text-sm font-medium text-gray-300 mb-3">Add Package</h3>
            <div className="flex space-x-2">
              <Input
                value={newPackage}
                onChange={(e) => setNewPackage(e.target.value)}
                placeholder="Enter package name (e.g., axios)"
                className="bg-gray-700 border-gray-600 text-white"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    addPackage(newPackage);
                  }
                }}
              />
              <Button
                onClick={() => addPackage(newPackage)}
                className="bg-green-600 hover:bg-green-700"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Popular Packages */}
          <div>
            <h3 className="text-sm font-medium text-gray-300 mb-3">Popular Packages</h3>
            <div className="mb-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search packages..."
                  className="pl-10 bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {filteredPopularPackages.map((pkg) => (
                <Button
                  key={pkg}
                  variant="outline"
                  size="sm"
                  onClick={() => addPackage(pkg)}
                  className="justify-start border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {pkg}
                </Button>
              ))}
            </div>
          </div>

          <div className="text-xs text-gray-500">
            <p>Note: Packages are loaded from CDN. Some packages may not work in the browser environment.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PackageManager;
