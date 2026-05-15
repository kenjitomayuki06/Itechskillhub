import { useState, useMemo } from 'react';
import { Search, ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from 'lucide-react';
import '../../styles/components/DataTable.css'

export default function DataTable({ 
  columns, 
  data, 
  searchable = true, 
  sortable = true,
  onRowClick,
  itemsPerPage = 10
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);

  // Search filtering with useMemo for performance
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    
    return data.filter(item =>
      columns.some(col => {
        if (col.searchable === false) return false;
        const value = col.accessor(item);
        return String(value).toLowerCase().includes(searchTerm.toLowerCase());
      })
    );
  }, [data, searchTerm, columns]);

  // Sorting with useMemo
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = sortConfig.key(a);
      const bValue = sortConfig.key(b);

      // Handle null/undefined values
      if (aValue == null) return 1;
      if (bValue == null) return -1;

      // Compare values
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPage);

  // Reset to page 1 when search changes
  useMemo(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleSort = (accessor) => {
    if (!sortable) return;
    
    setSortConfig(prev => ({
      key: accessor,
      direction: prev.key === accessor && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(Math.max(1, Math.min(totalPages, newPage)));
  };

  return (
    <div className="data-table-wrapper">
      {/* Search Bar */}
      {searchable && (
        <div className="table-search">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button 
              className="clear-search"
              onClick={() => setSearchTerm('')}
            >
              ✕
            </button>
          )}
        </div>
      )}

      {/* Results count */}
      <div className="table-info">
        Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, sortedData.length)} of {sortedData.length} results
        {searchTerm && ` (filtered from ${data.length} total)`}
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((col, index) => (
                <th 
                  key={index}
                  onClick={() => col.sortable !== false && handleSort(col.accessor)}
                  className={sortable && col.sortable !== false ? 'sortable' : ''}
                  style={{ width: col.width }}
                >
                  <div className="th-content">
                    <span>{col.header}</span>
                    {sortable && col.sortable !== false && (
                      <span className="sort-indicator">
                        {sortConfig.key === col.accessor ? (
                          sortConfig.direction === 'asc' ? 
                            <ChevronUp size={16} /> : 
                            <ChevronDown size={16} />
                        ) : (
                          <span className="sort-both">⇅</span>
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((item, rowIndex) => (
                <tr 
                  key={item.id || rowIndex}
                  onClick={() => onRowClick && onRowClick(item)}
                  className={onRowClick ? 'clickable' : ''}
                >
                  {columns.map((col, colIndex) => (
                    <td key={colIndex}>
                      {col.render ? col.render(item) : col.accessor(item)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="no-data">
                  {searchTerm ? 'No results found' : 'No data available'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="table-pagination">
          <button 
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            <ChevronLeft size={16} />
            Previous
          </button>
          
          <div className="pagination-numbers">
            {/* First page */}
            <button
              onClick={() => handlePageChange(1)}
              className={`pagination-number ${currentPage === 1 ? 'active' : ''}`}
            >
              1
            </button>

            {/* Show ellipsis if needed */}
            {currentPage > 3 && <span className="pagination-ellipsis">...</span>}

            {/* Middle pages */}
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(page => page !== 1 && page !== totalPages && Math.abs(page - currentPage) <= 1)
              .map(page => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`pagination-number ${currentPage === page ? 'active' : ''}`}
                >
                  {page}
                </button>
              ))
            }

            {/* Show ellipsis if needed */}
            {currentPage < totalPages - 2 && <span className="pagination-ellipsis">...</span>}

            {/* Last page */}
            {totalPages > 1 && (
              <button
                onClick={() => handlePageChange(totalPages)}
                className={`pagination-number ${currentPage === totalPages ? 'active' : ''}`}
              >
                {totalPages}
              </button>
            )}
          </div>

          <button 
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="pagination-btn"
          >
            Next
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}