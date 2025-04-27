"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Edit, Plus, Trash2 } from "lucide-react"

// Mock data for categories
const incomeCategories = [
  { id: 1, name: "Salary", subcategories: ["Monthly", "Bonus", "Commission"] },
  { id: 2, name: "Freelance", subcategories: ["Web Development", "Design", "Writing"] },
  { id: 3, name: "Investment", subcategories: ["Dividends", "Interest", "Capital Gains"] },
  { id: 4, name: "Rental", subcategories: ["Property", "Equipment", "Vehicle"] },
  { id: 5, name: "Other", subcategories: ["Gifts", "Refunds", "Miscellaneous"] },
]

const expenseCategories = [
  { id: 1, name: "Housing", subcategories: ["Rent", "Mortgage", "Utilities", "Maintenance"] },
  { id: 2, name: "Food", subcategories: ["Groceries", "Dining Out", "Delivery"] },
  { id: 3, name: "Transportation", subcategories: ["Fuel", "Public Transit", "Maintenance", "Insurance"] },
  { id: 4, name: "Utilities", subcategories: ["Electricity", "Water", "Internet", "Phone"] },
  { id: 5, name: "Entertainment", subcategories: ["Movies", "Games", "Subscriptions", "Events"] },
  { id: 6, name: "Healthcare", subcategories: ["Insurance", "Medications", "Doctor Visits"] },
  { id: 7, name: "Personal", subcategories: ["Clothing", "Grooming", "Gym"] },
  { id: 8, name: "Education", subcategories: ["Tuition", "Books", "Courses"] },
  { id: 9, name: "Other", subcategories: ["Gifts", "Donations", "Miscellaneous"] },
]

export default function CategoriesPage() {
  const [activeTab, setActiveTab] = useState("income")
  const [newCategory, setNewCategory] = useState("")
  const [newSubcategory, setNewSubcategory] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<any>(null)
  const [isAddSubcategoryOpen, setIsAddSubcategoryOpen] = useState(false)
  const [isEditCategoryOpen, setIsEditCategoryOpen] = useState(false)
  const [editCategoryName, setEditCategoryName] = useState("")

  const handleAddCategory = () => {
    if (!newCategory.trim()) return
    // Add category logic would go here
    setNewCategory("")
  }

  const handleAddSubcategory = () => {
    if (!newSubcategory.trim() || !selectedCategory) return
    // Add subcategory logic would go here
    setNewSubcategory("")
    setIsAddSubcategoryOpen(false)
  }

  const handleEditCategory = () => {
    if (!editCategoryName.trim() || !selectedCategory) return
    // Edit category logic would go here
    setEditCategoryName("")
    setIsEditCategoryOpen(false)
  }

  const handleDeleteCategory = (category: any) => {
    // Delete category logic would go here
  }

  const handleDeleteSubcategory = (category: any, subcategory: string) => {
    // Delete subcategory logic would go here
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Categories</h2>
        <p className="text-muted-foreground">Manage your income and expense categories</p>
      </div>

      <Tabs defaultValue="income" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList className="bg-slate-100 dark:bg-slate-800">
          <TabsTrigger value="income" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700">
            Income Categories
          </TabsTrigger>
          <TabsTrigger value="expense" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700">
            Expense Categories
          </TabsTrigger>
        </TabsList>

        <TabsContent value="income" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Income Categories</CardTitle>
              <CardDescription>Manage your income categories and subcategories</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Input
                  placeholder="New income category"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                />
                <Button onClick={handleAddCategory} className="bg-emerald-600 hover:bg-emerald-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Add
                </Button>
              </div>
              <div className="border rounded-md divide-y">
                {incomeCategories.map((category) => (
                  <div key={category.id} className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{category.name}</h3>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedCategory(category)
                            setEditCategoryName(category.name)
                            setIsEditCategoryOpen(true)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDeleteCategory(category)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </div>
                    <div className="pl-4 border-l space-y-2">
                      {category.subcategories.map((subcategory, index) => (
                        <div key={index} className="flex items-center justify-between py-1">
                          <span className="text-sm">{subcategory}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                            onClick={() => handleDeleteSubcategory(category, subcategory)}
                          >
                            <Trash2 className="h-3 w-3" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-sm"
                        onClick={() => {
                          setSelectedCategory(category)
                          setIsAddSubcategoryOpen(true)
                        }}
                      >
                        <Plus className="mr-1 h-3 w-3" />
                        Add subcategory
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expense" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Expense Categories</CardTitle>
              <CardDescription>Manage your expense categories and subcategories</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Input
                  placeholder="New expense category"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                />
                <Button onClick={handleAddCategory} className="bg-red-600 hover:bg-red-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Add
                </Button>
              </div>
              <div className="border rounded-md divide-y">
                {expenseCategories.map((category) => (
                  <div key={category.id} className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{category.name}</h3>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedCategory(category)
                            setEditCategoryName(category.name)
                            setIsEditCategoryOpen(true)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDeleteCategory(category)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </div>
                    <div className="pl-4 border-l space-y-2">
                      {category.subcategories.map((subcategory, index) => (
                        <div key={index} className="flex items-center justify-between py-1">
                          <span className="text-sm">{subcategory}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                            onClick={() => handleDeleteSubcategory(category, subcategory)}
                          >
                            <Trash2 className="h-3 w-3" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-sm"
                        onClick={() => {
                          setSelectedCategory(category)
                          setIsAddSubcategoryOpen(true)
                        }}
                      >
                        <Plus className="mr-1 h-3 w-3" />
                        Add subcategory
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Subcategory Dialog */}
      <Dialog open={isAddSubcategoryOpen} onOpenChange={setIsAddSubcategoryOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Subcategory</DialogTitle>
            <DialogDescription>Add a new subcategory to {selectedCategory?.name}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="subcategory">Subcategory Name</Label>
              <Input
                id="subcategory"
                placeholder="Enter subcategory name"
                value={newSubcategory}
                onChange={(e) => setNewSubcategory(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddSubcategoryOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddSubcategory}>Add Subcategory</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog open={isEditCategoryOpen} onOpenChange={setIsEditCategoryOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>Update the name of this category</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="category-name">Category Name</Label>
              <Input
                id="category-name"
                placeholder="Enter category name"
                value={editCategoryName}
                onChange={(e) => setEditCategoryName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditCategoryOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditCategory}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
