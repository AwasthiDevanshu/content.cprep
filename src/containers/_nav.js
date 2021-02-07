export default [
  {
    _name: 'CSidebarNav',
    _children: [
      {
        
        _name: 'CSidebarNavDropdown',
        name: 'Test Series',
        icon: 'cil-puzzle',
        items: [
          {
            _name: 'CSidebarNavItem',
            name: 'Test Series List',
            icon: 'cil-chart-pie',
            to: '/testSeries',
          },
          {
            _name: 'CSidebarNavItem',
            name: 'Add Test Series',
            icon: 'cil-chart-pie',
            to: '/add/testSeries',
          },
                
        ]
      },
      {
        _name: 'CSidebarNavItem',
        name: 'Get Public Url',
        icon: 'cil-chart-pie',
        to: '/misc/publicFiles',
      },
      {
        _name: 'CSidebarNavItem',
        name: 'Add Current Affairs',
        icon: 'cil-chart-pie',
        to: '/misc/addCurrentAffairs',
      },
    ]
  }
]