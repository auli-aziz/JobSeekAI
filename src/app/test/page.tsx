import { findJobsMatchingResume } from "~/actions/job-vector-search";



export default async function Page() {
  const resumeText = `
**Name:** Sarah Anderson  
**Title:** Freelance Content Writer  
**Email:** sarahwrites@example.com  
**Phone:** (555) 123-4567  
**Location:** Remote / Flexible  

---

### 💼 Summary

Experienced content writer with a strong background in crafting high-quality blog posts and articles on diverse topics such as **health & beauty, fitness, home decor, fashion, finance, legal, and medical** subjects. I specialize in SEO-friendly, engaging content that aligns with editorial guidelines and deadlines. Proven track record of collaborating with editorial teams and adapting to varied content requirements.

---

### ✍️ Writing Skills

- SEO content writing  
- Research-based articles  
- Blogging and long-form content  
- MS Word, Open Office  
- Team collaboration and remote work tools  
- Strong communication and time management  

---

### 📝 Writing Experience

**Freelance Writer**  
*Various Online Publications*  
*2018 – Present*

- Written over 300 blog posts on topics such as **parenting, relationships, real estate, and DIY**.
- Regular contributor to wellness and fitness blogs with **health-focused** content.
- Created promotional articles for restaurants and contracting businesses (plumbing, remodeling, etc.).
- Maintained clear and timely communication with editors and content managers.
- Delivered articles with tight deadlines using Microsoft Word and Open Office.

---

### 🖥️ Technical Requirements

- Reliable high-speed internet  
- Proficient with Word, Open Office, and Google Docs  
- Available for timely responses and feedback  
- Comfortable working as part of a remote editorial team  

---

### 💬 Notes

Available for assignments at $50/hour or $100/article rate. Open to long-term or ongoing content writing opportunities.

  `;
  const matchingJobs = await findJobsMatchingResume(resumeText);

  console.log("Top matching jobs:");
  matchingJobs.forEach((job, index) => {
    console.log(`${index + 1}. ${job.title} at ${job.companyName} - Score: ${job.similarityScore}`);
  });
  return (
    <p>simpansini banani</p>
  )
}

