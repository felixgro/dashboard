import MainForm from './components/MainForm';
import settings from './config/settings.json';
import './styles/App.css';

function Dashboard() {
  return (
    <>
      <MainForm
        defaultEngine="google"
        searchEngines={settings.searchEngines}
        commands={{}}
      />
    </>
  );
}

export default Dashboard;
