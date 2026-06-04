const fs = require('fs');
const path = require('path');

const scratchDir = __dirname;

function parseOrders() {
  const html = fs.readFileSync(path.join(scratchDir, 'orders.html'), 'utf-8');
  // Find tbody
  const tbodyStart = html.indexOf('<tbody');
  const tbodyEnd = html.indexOf('</tbody>', tbodyStart);
  if (tbodyStart === -1 || tbodyEnd === -1) return 'No tbody found';
  const tbodyHtml = html.substring(tbodyStart, tbodyEnd);
  
  // Let's find tr elements
  const trs = [];
  let currentIdx = 0;
  while (true) {
    const trStart = tbodyHtml.indexOf('<tr', currentIdx);
    if (trStart === -1) break;
    const trEnd = tbodyHtml.indexOf('</tr>', trStart);
    if (trEnd === -1) break;
    trs.push(tbodyHtml.substring(trStart, trEnd + 5));
    currentIdx = trEnd + 5;
  }
  
  return trs.map((tr, index) => {
    // Strip tags roughly or pull content
    const cells = [];
    let tdIdx = 0;
    while (true) {
      const tdStart = tr.indexOf('<td', tdIdx);
      if (tdStart === -1) break;
      const tdEnd = tr.indexOf('</td>', tdStart);
      if (tdEnd === -1) break;
      cells.push(tr.substring(tdStart, tdEnd + 5));
      tdIdx = tdEnd + 5;
    }
    
    // Extract data from cells
    const cleanCells = cells.map(c => c.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim());
    return { index, cleanCells, raw: cells };
  });
}

function parseTransactions() {
  const html = fs.readFileSync(path.join(scratchDir, 'transactions.html'), 'utf-8');
  const tbodyStart = html.indexOf('<tbody');
  const tbodyEnd = html.indexOf('</tbody>', tbodyStart);
  if (tbodyStart === -1 || tbodyEnd === -1) return 'No tbody found';
  const tbodyHtml = html.substring(tbodyStart, tbodyEnd);
  
  const trs = [];
  let currentIdx = 0;
  while (true) {
    const trStart = tbodyHtml.indexOf('<tr', currentIdx);
    if (trStart === -1) break;
    const trEnd = tbodyHtml.indexOf('</tr>', trStart);
    if (trEnd === -1) break;
    trs.push(tbodyHtml.substring(trStart, trEnd + 5));
    currentIdx = trEnd + 5;
  }
  
  return trs.map((tr, index) => {
    const cells = [];
    let tdIdx = 0;
    while (true) {
      const tdStart = tr.indexOf('<td', tdIdx);
      if (tdStart === -1) break;
      const tdEnd = tr.indexOf('</td>', tdStart);
      if (tdEnd === -1) break;
      cells.push(tr.substring(tdStart, tdEnd + 5));
      tdIdx = tdEnd + 5;
    }
    const cleanCells = cells.map(c => c.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim());
    return { index, cleanCells, raw: cells };
  });
}

function parseMessages() {
  const html = fs.readFileSync(path.join(scratchDir, 'messages.html'), 'utf-8');
  // Messages has a list of active users/chats, let's find class="chat-users" or items with contact list
  // Let's search for user list inside messages.html. Often it has simplebar class or contact elements.
  // Let's scan for references to names, avatar-X.jpg, etc.
  const regex = /avatar-\d\.jpg[\s\S]*?<h\d[^>]*>([\s\S]*?)<\/h\d>/gi;
  const names = [];
  let match;
  while ((match = regex.exec(html)) !== null) {
    names.push(match[1].replace(/<[^>]*>/g, '').trim());
  }
  return { names: [...new Set(names)] };
}

function parseInbox() {
  const html = fs.readFileSync(path.join(scratchDir, 'inbox.html'), 'utf-8');
  // Inbox has email rows. Let's look for tags like class="mail-list" or titles
  // We can search for titles, sender names
  const regex = /avatar-\d\.jpg[\s\S]*?<span[^>]*>([\s\S]*?)<\/span>/gi;
  const spans = [];
  let match;
  while ((match = regex.exec(html)) !== null) {
    spans.push(match[1].replace(/<[^>]*>/g, '').trim());
  }
  return { spans: [...new Set(spans)].slice(0, 15) };
}

function parsePost() {
  const html = fs.readFileSync(path.join(scratchDir, 'post.html'), 'utf-8');
  // Search for card titles or card descriptions
  // Let's find links to post-details.html which are blog posts
  const regex = /href="post-details\.html"[^>]*>([\s\S]*?)<\/a>/gi;
  const blogTitles = [];
  let match;
  while ((match = regex.exec(html)) !== null) {
    blogTitles.push(match[1].replace(/<[^>]*>/g, '').trim());
  }
  return { blogTitles: [...new Set(blogTitles)].filter(t => t.length > 5) };
}

const report = {
  orders: parseOrders(),
  transactions: parseTransactions(),
  messages: parseMessages(),
  inbox: parseInbox(),
  post: parsePost()
};

fs.writeFileSync(path.join(scratchDir, 'mock_report.json'), JSON.stringify(report, null, 2), 'utf-8');
console.log('Successfully written mock_report.json!');
