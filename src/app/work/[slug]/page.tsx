import { notFound } from "next/navigation";
import { Placeholder } from "@/components/ui/Placeholder";
import { Button } from "@/components/ui/Button";
import { Link } from "@/components/ui/Link";
import { Card, CardContent } from "@/components/ui/Card";
import { getProjectBySlug, getRelatedProjects, getAllProjects } from "@/lib/data/projects";
import { 
  ProjectHero, 
  ProjectHeroImage, 
  ProjectDetails, 
  ProjectSidebar,
  RelatedProjectsHeader,
  RelatedProjectCard,
  CTASection
} from "@/components/motion/MotionSection";

// Generate static paths for all projects
export async function generateStaticParams() {
  const projects = await getAllProjects();

  return projects.map((project) => ({
    slug: project.slug,
  }));
}

// Generate static props for each project page
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const projectData = await getProjectBySlug(params.slug);

  if (!projectData) {
    return {
      title: 'Project Not Found',
      description: 'The requested project could not be found.',
    };
  }

  return {
    title: `${projectData.project.title} | LGIT Consult`,
    description: projectData.project.description,
  };
}

// Set revalidation time for ISR
export const revalidate = 60; // Revalidate every 60 seconds

export default async function ProjectPage({ params }: { params: { slug: string } }) {
  // Find the project by slug
  const projectData = await getProjectBySlug(params.slug);

  // If project not found, show 404 page
  if (!projectData) {
    notFound();
  }

  // Extract project and mdxSource from the response
  const { project, mdxSource } = projectData;

  // Related projects (excluding current project)
  const relatedProjects = await getRelatedProjects(params.slug, 3);

  return (
    <>
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <ProjectHero custom={0}>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-fg/10 text-fg/80 px-2 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                {project?.title}
              </h1>
              <p className="text-lg text-fg/70">
                {project?.description}
              </p>
            </ProjectHero>
            <ProjectHeroImage custom={1}>
              <Placeholder 
                text={project?.title}
                bgColor="#0070f3"
                textColor="#ffffff"
                className="w-full h-full rounded-lg"
              />
            </ProjectHeroImage>
          </div>
        </div>
      </section>

      {/* Project Details */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <ProjectDetails custom={0} className="lg:col-span-2">
              <h2 className="text-3xl font-bold mb-6">Overview</h2>
              <p className="text-fg/80 mb-8">
                {project?.fullDescription}
              </p>

              <h3 className="text-2xl font-bold mb-4">The Challenge</h3>
              <p className="text-fg/80 mb-8">
                {project?.challenge}
              </p>

              <h3 className="text-2xl font-bold mb-4">Our Solution</h3>
              <p className="text-fg/80 mb-8">
                {project?.solution}
              </p>

              <h3 className="text-2xl font-bold mb-4">Results</h3>
              <p className="text-fg/80 mb-8">
                {project?.results}
              </p>

              {project?.website && (
                <div className="mt-8">
                  <Button href={project?.website} external variant="primary">
                    Visit Website
                  </Button>
                </div>
              )}
            </ProjectDetails>

            <ProjectSidebar custom={1}>
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">Project Details</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold text-fg/60">Client</h4>
                      <p>{project?.client}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-fg/60">Year</h4>
                      <p>{project?.year}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-fg/60">Services</h4>
                      <ul className="list-disc list-inside">
                        {project.services?.map((service) => (
                          <li key={service}>{service}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-fg/60">Technologies</h4>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {project.tags?.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs bg-fg/10 text-fg/80 px-2 py-1 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ProjectSidebar>
          </div>
        </div>
      </section>

      {/* Related Projects */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <RelatedProjectsHeader custom={0}>
            <h2 className="text-3xl font-bold mb-4">Related Projects</h2>
            <p className="text-fg/70 max-w-2xl mx-auto">
              Explore more of our work in similar areas.
            </p>
          </RelatedProjectsHeader>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedProjects.map((relatedProject, index) => (
              <RelatedProjectCard
                key={relatedProject.id}
                custom={index + 1}
              >
                <Card href={`/work/${relatedProject.slug}`} className="h-full">
                  <div className="relative h-48 w-full mb-4 rounded overflow-hidden">
                    <Placeholder 
                      text={relatedProject.title}
                      bgColor={index % 2 === 0 ? "#0070f3" : "#6366f1"}
                      textColor="#ffffff"
                      className="w-full h-full"
                    />
                  </div>
                  <CardContent>
                    <h3 className="text-xl font-bold mb-2">{relatedProject.title}</h3>
                    <p className="text-fg/70 mb-4">{relatedProject.description}</p>
                    <Link href={`/work/${relatedProject.slug}`} variant="underline">
                      View Case Study
                    </Link>
                  </CardContent>
                </Card>
              </RelatedProjectCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <CTASection custom={0}>
              <h2 className="text-3xl font-bold mb-4">Ready to Start Your Project?</h2>
              <p className="text-fg/70 mb-8">
                Contact us today to discuss how we can help bring your vision to life.
              </p>
              <Button href="/contact">
                Get in Touch
              </Button>
            </CTASection>
          </div>
        </div>
      </section>
    </>
  );
}
