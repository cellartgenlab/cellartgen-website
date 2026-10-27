document.addEventListener('DOMContentLoaded', () => {
  const files = document.getElementById('mmFiles');
  const form = document.getElementById('mmUploadForm');
  const gallery = document.getElementById('mmGallery');
  const selected = document.getElementById('mmSelected');
  if (!files || !form || !gallery) return;

  const mediaItems = [
    {type:'image', src:'img/8.jpg', title:'Automated Packaging Equipment', category:'Manufacturing Machines'},
    {type:'image', src:'img/10.jpg', title:'Industrial Processing Machine', category:'Manufacturing Machines'},
    {type:'image', src:'img/11.jpg', title:'Production Line Equipment', category:'Manufacturing Machines'},
    {type:'image', src:'img/13.jpg', title:'Processing Equipment', category:'Manufacturing Machines'},
    {type:'image', src:'img/14.jpg', title:'Conveyor & Sorting Equipment', category:'Manufacturing Machines'},
    {type:'image', src:'img/17.jpg', title:'Powder Processing Equipment', category:'Manufacturing Machines'},
    {type:'image', src:'img/21.jpg', title:'Manufacturing Machine Setup', category:'Manufacturing Machines'},
    {type:'image', src:'img/22.jpg', title:'Industrial Mixing Equipment', category:'Manufacturing Machines'},
    {type:'image', src:'img/23.jpg', title:'Mixing & Processing Vessel', category:'Manufacturing Machines'},
    {type:'image', src:'img/24.jpg', title:'Production Equipment', category:'Manufacturing Machines'},
    {type:'image', src:'img/OUR WORKSPACE1.jpg', title:'Manufacturing Workspace', category:'Facility Gallery'},
    {type:'image', src:'img/OUR WORKSPACE2.jpg', title:'Facility & Production Area', category:'Facility Gallery'},
    {type:'image', src:'img/OUR WORKSPACE3.jpg', title:'Laboratory Workspace', category:'Facility Gallery'},
    {type:'image', src:'img/WhatsApp-Image-2026-03-12-at-10.57.30-AM.jpeg', title:'Manufacturing Facility', category:'Facility Gallery'},
    {type:'video', src:'img/WhatsApp-Video-2026-03-12-at-10.57.21-AM.mp4', poster:'img/21.jpg', title:'Manufacturing Video', category:'Production Process'},
    {type:'video', src:'img/WhatsApp-Video-2026-03-12-at-10.57.24-AM.mp4', poster:'img/22.jpg', title:'Production Process Video', category:'Production Process'},
    {type:'video', src:'img/WhatsApp-Video-2026-03-12-at-10.59.44-AM.mp4', poster:'img/23.jpg', title:'Facility Operations Video', category:'Production Process'},
    {type:'video', src:'img/WhatsApp-Video-2026-03-15-at-7.44.59-PM.mp4', poster:'img/24.jpg', title:'Equipment in Operation', category:'Production Process'},
    {type:'video', src:'img/lab-work.mp4', poster:'img/OUR WORKSPACE2.jpg', title:'Laboratory & Manufacturing', category:'Production Process'},
    {type:'video', src:'img/2.mp4', poster:'img/11.jpg', title:'Manufacturing Process', category:'Production Process'}
  ];

  function createCard(item) {
    const card = document.createElement('article');
    card.className = 'mm-media-card';
    card.dataset.kind = item.type;
    card.dataset.category = item.category;
    let media;
    if (item.type === 'video') {
      media = document.createElement('video');
      media.controls = true;
      media.preload = 'metadata';
      if (item.poster) media.poster = item.poster;
      media.playsInline = true;
    } else {
      media = document.createElement('img');
      media.alt = item.title;
      media.loading = 'lazy';
    }
    media.src = item.src;
    const meta = document.createElement('div');
    meta.className = 'mm-media-meta';
    const small = document.createElement('small');
    small.textContent = item.category + (item.type === 'video' ? ' · VIDEO' : ' · PHOTO');
    const heading = document.createElement('h3');
    heading.textContent = item.title;
    meta.append(small, heading);
    card.append(media, meta);
    return card;
  }

  function renderInitialGallery() {
    gallery.replaceChildren(...mediaItems.map(createCard));
  }
  renderInitialGallery();

  let chosen = [];
  files.addEventListener('change', () => {
    chosen = Array.from(files.files || []);
    selected.textContent = chosen.length ? chosen.map(file => file.name).join(' · ') : 'No files selected yet.';
  });

  // Support dropping files directly onto the upload area.
  const dropzone = document.querySelector('.mm-dropzone');
  if (dropzone) {
    ['dragenter','dragover'].forEach(type => dropzone.addEventListener(type, event => {
      event.preventDefault(); dropzone.classList.add('is-dragging');
    }));
    ['dragleave','drop'].forEach(type => dropzone.addEventListener(type, event => {
      event.preventDefault(); dropzone.classList.remove('is-dragging');
    }));
    dropzone.addEventListener('drop', event => {
      const dropped = Array.from(event.dataTransfer.files || []).filter(file => file.type.startsWith('image/') || file.type.startsWith('video/'));
      chosen = dropped;
      selected.textContent = chosen.length ? chosen.map(file => file.name).join(' · ') : 'No supported photos or videos selected.';
    });
  }

  form.addEventListener('submit', event => {
    event.preventDefault();
    const title = document.getElementById('mmTitle').value.trim();
    const category = document.getElementById('mmCategory').value;
    if (!title || !chosen.length) {
      alert('Please enter a title and select at least one photo or video.');
      return;
    }
    chosen.forEach(file => {
      const isVideo = file.type.startsWith('video/');
      const url = URL.createObjectURL(file);
      const card = createCard({type:isVideo ? 'video' : 'image', src:url, title, category});
      card.classList.add('mm-local-preview');
      gallery.prepend(card);
    });
    applyFilter(document.querySelector('.mm-filter.active')?.dataset.filter || 'all');
    document.getElementById('media-gallery').scrollIntoView({behavior:'smooth'});
    form.reset();
    chosen = [];
    selected.textContent = 'No files selected yet.';
  });

  function applyFilter(filter) {
    gallery.querySelectorAll('.mm-media-card').forEach(card => {
      const kind = card.dataset.kind;
      card.hidden = filter === 'image' ? kind !== 'image' : filter === 'video' ? kind !== 'video' : false;
    });
  }
  document.querySelectorAll('.mm-filter').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('.mm-filter').forEach(item => item.classList.remove('active'));
    button.classList.add('active');
    applyFilter(button.dataset.filter);
  }));
});
