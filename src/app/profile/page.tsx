import { Button } from "~/components/ui/button"
import { Badge } from "~/components/ui/badge"
import { Card, CardContent } from "~/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import {
  User,
  Settings,
  Briefcase,
  BookOpen,
  Award,
  MapPin,
  Mail,
  Phone,
  Calendar,
  Edit,
  Plus,
} from "lucide-react"
import { getResumebyProfileId, getProfileByUserId } from "~/server/db/queries"
import { auth } from "~/server/auth"
import Link from "next/link"

export default async function ProfilePage() {
  const session = await auth()
  if(!session){
    console.log("User not authenticated")
  }
  const user = session?.user
  const userId = await getProfileByUserId(user?.id ?? "yuhu")
  const profileData = await getResumebyProfileId(userId?.id ?? 2)
  
  return (
    <div className="flex min-h-screen bg-background">
      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-background backdrop-blur-md border-b border-border-secondary">
          <div className="container px-4 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">Profile</h1>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
                <Link href="/edit-profile">
                  <Button size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </header>
        {/* <p>{JSON.stringify(profileData, null, 2)}</p> */}

        {/* Profile Overview */}
        <div className="container px-4 py-6">
          <Card className="mb-6 border-border-primary">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
              <Avatar className="h-24 w-24 border-2 border-white shadow-sm">
              <AvatarImage
                src="/placeholder.svg?height=96&width=96"
                alt={user?.name ?? "User"} // Handle undefined or null with a fallback
              />
              <AvatarFallback>
                {user?.name
                  ? user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                  : "UN"} {/* Fallback initials if name is not available */}
              </AvatarFallback>
            </Avatar>

                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">{profileData?.name}</h2>
                      <p className="text-slate-600">{profileData?.title}</p>

                      <div className="flex flex-wrap gap-2 mt-2">
                        <div className="flex items-center text-sm text-slate-500">
                          <MapPin className="h-4 w-4 mr-1" />
                          {/* {profileData?.} */}
                        </div>
                        <div className="flex items-center text-sm text-slate-500">
                          <Mail className="h-4 w-4 mr-1" />
                          {profileData?.email}
                        </div>
                        <div className="flex items-center text-sm text-slate-500">
                          <Calendar className="h-4 w-4 mr-1" />
                          {/* Joined {profileData?.joinDate} */}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Phone className="h-4 w-4 mr-2" />
                        Contact
                      </Button>
                      <Button variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Connect
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs Navigation */}
          <Tabs defaultValue="overview" className="space-y-4">
            <div className="flex justify-between items-center">
              <TabsList>
                <TabsTrigger value="overview" className="data-[state=active]:bg-slate-100">
                  <User className="h-4 w-4 mr-2" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="experience" className="data-[state=active]:bg-slate-100">
                  <Briefcase className="h-4 w-4 mr-2" />
                  Experience
                </TabsTrigger>
                <TabsTrigger value="education" className="data-[state=active]:bg-slate-100">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Education
                </TabsTrigger>
                <TabsTrigger value="certifications" className="data-[state=active]:bg-slate-100">
                  <Award className="h-4 w-4 mr-2" />
                  Certifications
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* About Section */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-3">About</h3>
                  <p className="text-slate-600">{profileData?.about}</p>
                </CardContent>
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-semibold">Skills</h3>
                    <Button variant="ghost" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Skill
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {profileData?.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="px-3 py-1">
                        {/* {skill} */}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Experience Preview */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-semibold">Experience</h3>
                    <Button variant="ghost" size="sm">
                      View All
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {profileData?.experiences.slice(0, 2).map((exp) => (
                      <div key={exp.id} className="flex gap-4">
                        <div className="h-10 w-10 rounded bg-slate-100 flex items-center justify-center">
                          <Briefcase className="h-5 w-5 text-slate-500" />
                        </div>
                        <div>
                          <h4 className="font-medium text-slate-900">{exp.role}</h4>
                          <p className="text-sm text-slate-600">
                            {exp.company} · {exp.period}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Experience Tab */}
            <TabsContent value="experience" className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold">Work Experience</h3>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Experience
                    </Button>
                  </div>
                  <div className="space-y-8">
                    {profileData?.experiences.map((exp) => (
                      <div key={exp.id} className="relative pl-8 pb-8 border-l border-slate-200 last:pb-0">
                        <div className="absolute left-0 top-0 -translate-x-1/2 h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center">
                          <Briefcase className="h-3 w-3 text-slate-500" />
                        </div>
                        <div>
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                            <h4 className="font-semibold text-slate-900">{exp.role}</h4>
                            <Badge variant="outline">{exp.period}</Badge>
                          </div>
                          <p className="text-sm text-slate-600 mt-1">{exp.company}</p>
                          <p className="mt-3 text-slate-600">{exp.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Education Tab */}
            <TabsContent value="education" className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold">Education</h3>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Education
                    </Button>
                  </div>
                  <div className="space-y-8">
                    {profileData?.educations.map((edu) => (
                      <div key={edu.id} className="relative pl-8 pb-8 border-l border-slate-200 last:pb-0">
                        <div className="absolute left-0 top-0 -translate-x-1/2 h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center">
                          <BookOpen className="h-3 w-3 text-slate-500" />
                        </div>
                        <div>
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                            <h4 className="font-semibold text-slate-900">{edu.degree}</h4>
                            <Badge variant="outline">{edu.period}</Badge>
                          </div>
                          <p className="text-sm text-slate-600 mt-1">{edu.institution}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Certifications Tab */}
            <TabsContent value="certifications" className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold">Certifications</h3>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Certification
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profileData?.certifications.map((cert) => (
                      <Card key={cert.id} className="border-slate-200">
                        <CardContent className="p-4 flex gap-4">
                          <div className="h-10 w-10 rounded bg-slate-100 flex items-center justify-center">
                            <Award className="h-5 w-5 text-slate-500" />
                          </div>
                          <div>
                            <h4 className="font-medium text-slate-900">{cert.name}</h4>
                            <p className="text-sm text-slate-600">
                              {cert.issuer} · {cert.date}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
