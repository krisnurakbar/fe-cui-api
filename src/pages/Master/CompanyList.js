import React, { useState, useEffect } from 'react';
import { Paper, Button, responsiveFontSizes } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import companiesService from '../../services/companiesService';
import CompanyCreate from './CompanyCreate';
import dayjs from 'dayjs';
import axios from 'axios';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';

const CompanyList = () => {
  const [companies, setCompanies] = useState([]);
  const [paginationModel, setPaginationModel] = useState({ pageSize: 5, page: 0 });
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await companiesService.getCompanies();
        setCompanies(response.data || []);
      } catch (error) {
        console.error('Error fetching companies:', error);
      }
    };

    fetchData();
  }, []);

  const handleStatusUpdate = async (id, currentStatus) => {
    const newStatus = !currentStatus;
  
    try {
      const response = await axios.patch(`${process.env.REACT_APP_API_BASE_URL}/companies/${id}/${newStatus}`);
      if (response.status === 200) {
        setCompanies(prevCompanies =>
          prevCompanies.map(company =>
            company.id === id ? { ...company, status: newStatus } : company
          )
        );
        setSnackbarMessage(`Company ${response.name} status updated to ${newStatus ? 'active' : 'inactive'}`);
        setOpenSnackbar(true);
      }
    } catch (error) {
      setSnackbarMessage(`Error updating company status: ${error.message}`);
      setOpenSnackbar(true);
    }
  };

  const columns = React.useMemo(
    () => [
      { field: 'id', headerName: 'ID', flex: 1, minWidth: 90 },
      { field: 'name', headerName: 'Name', flex: 3, minWidth: 150 },
      { field: 'status', headerName: 'Status', flex: 1, minWidth: 90,
        renderCell: (params) => (
          <>
            <IconButton
              color={params.row.status ? 'success' : 'error'} // Green for active, red for deactivate
              onClick={() => handleStatusUpdate(params.row.id, params.row.status, params.row.name)}
              size='small'
              aria-label={params.row.status ? 'Deactivate' : 'Activate'}
            >
              {params.row.status ? <CheckIcon /> : <CloseIcon />}
            </IconButton>
          </>
        ),
       },
      { field: 'created_at', headerName: 'Created At', flex: 1, minWidth: 150, 
        valueFormatter: (params) => dayjs(params.value).format('YYYY-MM-DD') },
      { field: 'modified_at', headerName: 'Modified At', flex: 1, minWidth: 150, 
          valueFormatter: (params) => dayjs(params.value).format('YYYY-MM-DD') },
      {
        field: 'action',
        headerName: 'Action',
        flex: 1,
        minWidth: 150,
        renderCell: (params) => (
          <Button
            variant="contained"
            color={params.row.status ? 'secondary' : 'primary'}
            onClick={() => handleStatusUpdate(params.row.id, params.row.status)}
          >
            {params.row.status ? 'Deactivate' : 'Activate'}
          </Button>
        ),
      },
    ],
    []
  );

  const rows = React.useMemo(
    () =>
      companies
        .filter((company) => company?.id != null)
        .sort((a, b) => a.id - b.id)
        .map((company) => ({
          id: company.id,
          name: company.name,
          status: company.status,
          created_at: company.created_at,
          modified_at: company.modified_at,
        })),
    [companies]
  );

  return (
    <Paper sx={{ height: 'calc(81vh - 0px)', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end'}}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenDrawer(true)}
          size='small'
          sx={{ m: 2 }}
        >
          Add New
        </Button>
      </div>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{ pagination: paginationModel }}
        onPaginationModelChange={(newModel) => setPaginationModel(newModel)}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        sx={{ border: 0 }}
      />
      <CompanyCreate />
      <CompanyCreate open={openDrawer} onClose={() => setOpenDrawer(false)} />
    </Paper>
  );
};

export default CompanyList;

