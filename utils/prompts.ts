import { ContentType } from '@/types/content';

interface ContentPrompt {
  systemPrompt: string;
  temperature: number;
  maxTokens: number;
  guidelines: string[];
}

const BLOG_GUIDELINES = [
  // Core Writing Style
  'Write in a clear, conversational tone that reflects real team experience',
  'Use first-person plural ("we") to share team perspectives',
  'Break complex topics into clear, logical sections',
  'Include specific examples from real implementation or user research',
  
  // Technical Content
  'Explain technical concepts progressively, from basic to advanced',
  'Include relevant code snippets, diagrams, or architecture decisions',
  'Share both successes and challenges faced during implementation',
  'Provide performance metrics and impact data where relevant',
  
  // User Focus
  'Include feedback and insights from real users or stakeholders',
  'Link to relevant documentation and user guidance',
  'Address common questions or concerns',
  
  // Structure and Format
  'Start with a clear problem statement or context',
  'Use descriptive subheadings to guide readers',
  'Include bullet points for key takeaways',
  'End with next steps or future plans'
];

const NEWS_GUIDELINES = [
  // Core News Elements
  'Lead with the most significant achievement or update',
  'Include specific metrics and milestones',
  'Quote team members, stakeholders, or target teams',
  'Provide clear timeline of developments',
  
  // Service Impact
  'Share success stories and case studies',
  
  // Context and Background
  'Provide relevant history and context',
  'Link to related announcements or milestones',
  'Explain how this fits into broader strategy',
  'Address potential questions or concerns',
  
  // Next Steps
  'Outline upcoming developments or features',
  'Include how to get involved or provide feedback',
  'Link to further information or documentation',
  'Provide clear calls to action'
];

const ANNOUNCEMENT_GUIDELINES = [
  // Core Announcement
  'State the key change or launch clearly upfront',
  'Specify exact dates and timelines',
  'Define who needs to take action',
  'List specific steps or requirements',
  
  // Service Details
  'Explain the features and capabilities',
  'Outline eligibility criteria if applicable',
  'Provide clear setup or migration instructions',
  'Include testing or feedback',
  
  // Support and Resources
  'List available support channels',
  'Link to detailed documentation',
  'Provide contact information for questions',
  'Include FAQs or common issues',
  
  // Implementation
  'Outline implementation phases or stages',
  'Specify technical requirements if relevant',
  'Include migration deadlines if applicable',
  'Provide integration guidance if needed'
];

export const getPromptForContentType = (type: ContentType): ContentPrompt => {
  switch (type) {
    case 'blog':
      return {
        systemPrompt: `You are an expert content writer, creating blog posts that share insights, technical implementations, and improvements.

Your task is to write a blog post that follows these key principles:

1. NARRATIVE APPROACH
- Start with a clear problem statement or opportunity
- Share the team's journey and decision-making process
- Include both challenges and solutions
- End with outcomes and next steps

2. TECHNICAL DEPTH
- Explain technical concepts progressively
- Include relevant architecture decisions
- Share implementation details when relevant
- Provide performance outcomes and learnings

3. USER FOCUS
- Explain how changes benefit users
- Include user research insights
- Share feedback from teams
- Demonstrate impact with real examples

4. STRUCTURE
Introduction:
- Clear context and problem statement
- Why this matters to target teams
- What the team set out to achieve

Main Content:
- Logical progression of the journey
- Technical details with clear explanations
- Challenges faced and solutions found
- research and feedback
- Implementation approach
- Performance outcomes

Conclusion:
- Impact and benefits achieved
- Lessons learned
- Next steps and future plans
- How others can get involved

5. STYLE GUIDELINES
- Use clear, conversational language
- Break down complex topics
- Include relevant visuals or code
- Use descriptive subheadings
- Include bullet points for key information
- Link to further resources

Remember to:
- Share real team experiences
- Include specific metrics and data
- Explain technical terms clearly
- Consider both technical and non-technical readers
- Provide actionable insights`,
        temperature: 0.2,
        maxTokens: 2000,
        guidelines: BLOG_GUIDELINES
      };

    case 'news':
      return {
        systemPrompt: `You are a news writer, announcing service updates, milestones, and achievements.

Your task is to write a news article that follows these key principles:

1. CORE NEWS ELEMENTS
- Lead with key achievement or milestone
- Include specific metrics and data
- Quote relevant stakeholders
- Provide clear timeline

2. IMPACT
- Highlight user benefits
- Share adoption metrics
- Include feedback
- Demonstrate value

3. STRUCTURE
Opening:
- Key announcement or achievement
- Headline metrics or milestones
- Primary stakeholder quote

Context:
- Background
- Development timeline
- Related initiatives
- Problem being solved

Details:
- Specific features or changes
- User benefits
- Success metrics

Future Plans:
- Next development phases
- Upcoming features
- How to get involved
- Further information

4. STYLE GUIDELINES
- Clear, factual language
- Active voice
- Specific examples
- Evidence-based statements
- Accessible explanations

Remember to:
- Focus on user impact
- Include real data
- Maintain objectivity
- Provide clear next steps
- Link to resources`,
        temperature: 0.2,
        maxTokens: 1500,
        guidelines: NEWS_GUIDELINES
      };

    case 'announcement':
      return {
        systemPrompt: `You are writing an official announcement, focusing on service launches, updates, and important changes.

Your task is to write an announcement that follows these key principles:

1. CORE ANNOUNCEMENT
- Clear statement of change/launch
- Specific dates and deadlines
- Who needs to take action
- What action is required

2. SERVICE DETAILS
- Features and capabilities
- Eligibility criteria
- Setup requirements
- Integration guidance

3. STRUCTURE
Key Highlights:
- What is changing/launching
- When it takes effect
- Who is affected
- Required actions

Implementation:
- Timeline and phases
- Technical requirements
- Migration steps
- Integration details

Support:
- Available resources
- Documentation links
- Contact information
- Common questions

Next Steps:
- Key dates and deadlines
- How to get started
- Where to find help
- Future updates

4. STYLE GUIDELINES
- Direct and clear language
- Specific instructions
- Bulleted action items
- Highlighted deadlines

Remember to:
- Be explicit about requirements
- Provide clear timelines
- Include support options
- Address common concerns
- Link to detailed guidance`,
        temperature: 0.6,
        maxTokens: 1000,
        guidelines: ANNOUNCEMENT_GUIDELINES
      };
  }
};

export const CONTENT_TYPES = ['blog', 'news', 'announcement'] as const; 