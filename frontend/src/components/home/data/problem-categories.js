import { 
    DataArray,
    Code,
    AccountTree,
    Sort,
    Functions,
    Hub,
    LinearScale,
    Memory,
    FindInPage
} from '@mui/icons-material';

export const categoryConfig = {
    'arrays': {
        title: 'Arrays',
        icon: <DataArray sx={{ fontSize: 32 }} />,
        color: '#7b5cff'
    },
    'strings': {
        title: 'Strings',
        icon: <Code sx={{ fontSize: 32 }} />,
        color: '#00e0d3'
    },
    'trees': {
        title: 'Trees',
        icon: <AccountTree sx={{ fontSize: 32 }} />,
        color: '#ff6b6b'
    },
    'recursion': {
        title: 'Recursion',
        icon: <Sort sx={{ fontSize: 32 }} />,
        color: '#4dabf7'
    },
    'dynamic programming': {
        title: 'Dynamic Programming',
        icon: <Functions sx={{ fontSize: 32 }} />,
        color: '#ffd43b'
    },
    'graphs': {
        title: 'Graphs',
        icon: <Hub sx={{ fontSize: 32 }} />,
        color: '#d4ff3b'
    },
    'linked list': {
        title: 'Linked List',
        icon: <LinearScale sx={{ fontSize: 32 }} />,
        color: '#ffd43b'
    },
    'bit manipulation': {
        title: 'Bit Manipulation',
        icon: <Memory sx={{ fontSize: 32 }} />,
        color: '#ff6b6b'
    },
    'binary search': {
        title: 'Binary Search',
        icon: <FindInPage sx={{ fontSize: 32 }} />,
        color: '#4dabf7'
    }
}
