import { ChevronDownIcon } from "lucide-react";

export default function HowToPage() {
    const features = [
      {
        id: "01",
        title: "Offer 1:1 sessions",
        description: "Mentorship sessions, consultations, discovery calls - do what you do best. We take care of everything else"
      },
      {
        id: "02",
        title: "Setup Priority DM in seconds",
        description: ""
      },
      {
        id: "03",
        title: "Host a webinar",
        description: ""
      },
      {
        id: "04",
        title: "Bundle your services",
        description: ""
      },
      {
        id: "05",
        title: "Sell courses & products",
        description: ""
      },
      {
        id: "06",
        title: "Sell a subscription",
        description: ""
      }
    ];
  
    return (
      <div className="container py-20">
        <div className="grid grid-cols-2 gap-20">
          {/* Calendrier de gauche */}
          <div className="bg-rose-100 rounded-3xl p-8">
            <div className="bg-white rounded-xl p-6 max-w-sm">
              <div className="flex items-start gap-3">
                <div className="relative">
                  <img 
                    src="avatar.jpg" 
                    alt="Expert" 
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-blue-500 rounded-full border-2 border-white" />
                </div>
                <div>
                  <h3 className="font-semibold">Book session</h3>
                  <p className="text-sm text-muted-foreground">Select date & time</p>
                </div>
              </div>
  
              <div className="mt-6 grid grid-cols-4 gap-2 text-center">
                <div className="text-sm">
                  <div className="text-muted-foreground mb-2">Fri</div>
                  <div>29 Sep</div>
                </div>
                <div className="text-sm border rounded-lg p-2 bg-primary/5">
                  <div className="text-muted-foreground mb-2">Sat</div>
                  <div>30 Sep</div>
                </div>
                <div className="text-sm">
                  <div className="text-muted-foreground mb-2">Sun</div>
                  <div>31 Sep</div>
                </div>
                <div className="text-sm">
                  <div className="text-muted-foreground mb-2">Mon</div>
                  <div>01 Oct</div>
                </div>
              </div>
  
              <div className="mt-6 flex justify-between items-center">
                <div>
                  <div className="text-sm text-muted-foreground">Next available</div>
                  <div className="font-medium">07:00pm, Tue 29st</div>
                </div>
                <button className="bg-black text-white rounded-md px-4 py-2">
                  Book
                </button>
              </div>
            </div>
          </div>
  
          {/* Liste des fonctionnalités */}
          <div className="space-y-12">
            {features.map((feature) => (
              <div 
                key={feature.id}
                className="group border-b pb-8"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-primary mb-2">{feature.id}</div>
                    <h2 className="text-2xl font-semibold">{feature.title}</h2>
                  </div>
                  <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronDownIcon className="h-6 w-6" />
                  </button>
                </div>
                {feature.description && (
                  <p className="mt-4 text-muted-foreground">
                    {feature.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }